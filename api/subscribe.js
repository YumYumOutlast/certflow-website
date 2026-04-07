import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email } = req.body || {};

  if (!email || !email.includes("@")) {
    return res.status(400).json({ error: "Valid email is required." });
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    // Check if already subscribed
    const { data: existing } = await supabase
      .from("subscribers")
      .select("id")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (existing) {
      return res.status(200).json({ message: "You're already subscribed!" });
    }

    // Insert new subscriber
    const { error: insertError } = await supabase
      .from("subscribers")
      .insert({ email: normalizedEmail });

    if (insertError) {
      console.error("Supabase insert error:", insertError);
      return res.status(500).json({ error: "Failed to subscribe. Please try again." });
    }

    // Send welcome email
    const { error: emailError } = await resend.emails.send({
      from: "CertFlo <hello@certflo.io>",
      to: normalizedEmail,
      subject: "Welcome to CertFlo — You're In",
      html: `<p>Hey there,</p>
<p>Thanks for subscribing. You just made a smart move.</p>
<p>We'll send you actionable insights on AI automation and how to stay ahead of the curve — no fluff, no spam.</p>
<p>In the meantime, grab the free <a href="https://getfluxe.gumroad.com/l/FlowState">FlowState guide</a> to start building your AI advantage today.</p>
<p>— The CertFlo Team</p>`,
    });

    if (emailError) {
      console.error("Resend email error:", emailError);
      // Subscriber is saved — don't fail the request over a welcome email
    }

    return res.status(200).json({ message: "You're in! Check your inbox." });
  } catch (err) {
    console.error("Subscribe handler error:", err);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
}

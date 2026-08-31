/**
 * Shared email chrome for all Lampas .ai transactional emails (signup
 * confirmation, expiry reminders, ...). Adapted from the Wonjo app's own
 * email-layout.ts - same brand colors (#4A8896/#7D4E2E happen to already
 * match Lampasai's --color-teal/--color-brown), same card/gradient-frame
 * structure, swapped for Lampasai's own font, logo and wordmark.
 *
 * ASSUMED LIMITATION: no mail client guarantees loading a remote font. The
 * <link> below is honored by Apple Mail/iOS; Gmail strips it and falls back
 * to the system stack. Rendering stays correct everywhere, on-brand where
 * possible.
 */

const BRAND_FONT =
  "'Space Grotesk','Trebuchet MS','Segoe UI',-apple-system,BlinkMacSystemFont,sans-serif";

/** Place in <head>: harmless where the font is ignored. */
export const EMAIL_FONT_LINK =
  '<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700&display=swap" rel="stylesheet">';

/** Uniform greeting heading. */
export function emailSalutation(firstName?: string | null): string {
  const name = (firstName ?? "").trim();
  return `<h1 style="margin:0 0 14px;font-size:20px;font-weight:700;color:#14142B;">${
    name ? `Bonjour ${name}` : "Bonjour"
  }</h1>`;
}

export function emailHeader(): string {
  return `
            <td style="background-color:#4A8896;background:linear-gradient(135deg,#4A8896,#7D4E2E);padding:28px 40px;">
              <table cellpadding="0" cellspacing="0" role="presentation" align="center" style="margin:0 auto;">
                <tr>
                  <td valign="middle" style="padding:0 14px 0 0;">
                    <table cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td width="56" height="56" align="center" valign="middle" style="background-color:#ffffff;border-radius:28px;">
                          <img src="https://lampasai.com/email-logo.png" alt="Lampas .ai" width="36" height="32" style="display:block;" />
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td valign="middle" style="padding:0;text-align:left;">
                    <p style="margin:0 0 4px 0;font-family:${BRAND_FONT};font-size:24px;font-weight:700;color:#ffffff;letter-spacing:1px;line-height:1;">Lampas .ai</p>
                    <table cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td style="font-size:9px;color:#ffffff;letter-spacing:2px;text-transform:uppercase;white-space:nowrap;">Certifications Data &amp; IA</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>`;
}

/**
 * Body: a plain white cell. The frame is NOT here - it wraps the whole card
 * (see emailFrameOpen/emailFrameClose), otherwise the card border and the
 * body border would nest into two visible outlines.
 */
export function emailBody(contentHtml: string): string {
  return `
                  <tr>
                    <td style="padding:32px 30px;">
${contentHtml}
                    </td>
                  </tr>`;
}

/** Card: white outer table, rounded corners. Carries the header full-width, then the gradient frame beneath it. */
export function emailCardOpen(): string {
  return `
        <table width="520" cellpadding="0" cellspacing="0" role="presentation"
               style="background-color:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">`;
}

export function emailCardClose(): string {
  return `
        </table>`;
}

/**
 * Gradient frame on the sides and bottom ONLY, open under the header (which
 * is already a full-width gradient - a rule running alongside it would
 * border a gradient with a gradient). Email constraint: no `border-image`,
 * so the gradient is a cell BACKGROUND and the white card sits on top of
 * it; the frame's thickness is the margin between the two. Outlook ignores
 * linear-gradient, hence the flat-color fallback via background-color.
 */
export function emailFrameOpen(): string {
  return `
          <tr>
            <td style="padding:0 0.5px 0.5px;background-color:#BBD0DA;background-image:linear-gradient(135deg,#BBD0DA,#CDBCB6);">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
                     style="background-color:#ffffff;border-radius:0 0 19.5px 19.5px;overflow:hidden;">`;
}

export function emailFrameClose(): string {
  return `
              </table>
            </td>
          </tr>`;
}

/** Shared footer. White background (not the page's off-white) so the top rule reads as the card's own edge, not a line floating below it. */
export function emailFooter(): string {
  return `
                  <tr>
                    <td style="background-color:#ffffff;padding:20px 30px 24px;text-align:center;border-top:1px solid #F0F0F0;">
                      <p style="margin:0;font-size:12px;color:#9CA3AF;">
                        © 2026 <a href="https://lampasai.com" style="color:#4A8896;text-decoration:none;font-weight:700;">Lampas .ai</a>
                        · <a href="mailto:contact@lampasai.com" style="color:#4A8896;text-decoration:none;">Nous contacter</a><br>
                        Email automatique, merci de ne pas y répondre.
                      </p>
                    </td>
                  </tr>`;
}

/** Full page wrapper: off-white background, centers the card. */
export function emailPage(cardHtml: string): string {
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    ${EMAIL_FONT_LINK}
  </head>
  <body style="margin:0;padding:32px 16px;background-color:#F8F7FF;">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td align="center">
${cardHtml}
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

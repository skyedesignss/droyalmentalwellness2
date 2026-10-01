<?php

declare(strict_types=1);

function buildCustomerReplyEmail(
    string $customerName,
    string $message
): string {

    $customerNameEscaped = htmlspecialchars(
        $customerName,
        ENT_QUOTES,
        'UTF-8'
    );

    $messageEscaped = nl2br(
        htmlspecialchars(
            $message,
            ENT_QUOTES,
            'UTF-8'
        )
    );

    $logoUrl = 'https://i.postimg.cc/J070CH5V/droyal-logo.webp';

    return <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Droyal Mental Wellness</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f6f8;font-family:Arial,Helvetica,sans-serif;color:#1a2129;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f6f8;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background-color:#ffffff;border-radius:10px;overflow:hidden;border:1px solid #e6eaee;">

          <!-- Header -->
          <tr>
            <td style="background-color:#0f2744;padding:28px 32px;text-align:center;">
              <img
                src="{$logoUrl}"
                alt="Droyal Mental Wellness"
                width="160"
                style="display:block;margin:0 auto;width:160px;max-width:100%;height:auto;border:0;"
              >
            </td>
          </tr>

          <!-- Accent line -->
          <tr>
            <td style="height:4px;background-color:#1d5543;font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 32px 28px;font-size:16px;line-height:1.7;color:#1a2129;">
              <p style="margin:0 0 20px 0;">Dear {$customerNameEscaped},</p>
              <div style="margin:0 0 28px 0;color:#2c3640;">
                {$messageEscaped}
              </div>
              <p style="margin:0 0 4px 0;">Warm regards,</p>
              <p style="margin:0;font-weight:bold;color:#0f2744;">Droyal Mental Wellness</p>
            </td>
          </tr>

          <!-- Contact -->
          <tr>
            <td style="padding:24px 32px;background-color:#f4f6f8;border-top:1px solid #e6eaee;">
              <p style="margin:0 0 10px 0;font-size:14px;font-weight:bold;color:#0f2744;">
                Droyal Mental Wellness
              </p>
              <p style="margin:0 0 8px 0;font-size:13px;line-height:1.6;color:#556270;">
                301 Main Street, Suite 1E<br>
                Reisterstown, MD 21136
              </p>
              <p style="margin:0 0 4px 0;font-size:13px;line-height:1.6;color:#556270;">
                <a href="tel:+13475136514" style="color:#0f2744;text-decoration:none;">347-513-6514</a>
                &nbsp;·&nbsp;
                <a href="tel:+16674393750" style="color:#0f2744;text-decoration:none;">667-439-3750</a>
              </p>
              <p style="margin:0 0 4px 0;font-size:13px;color:#556270;">
                <a href="mailto:info@droyalmentalwellness.org" style="color:#0f2744;text-decoration:none;">info@droyalmentalwellness.org</a>
              </p>
              <p style="margin:0;font-size:13px;">
                <a href="https://droyalmentalwellness.org" style="color:#1d5543;text-decoration:none;">droyalmentalwellness.org</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:18px 32px;text-align:center;background-color:#ffffff;border-top:1px solid #e6eaee;">
              <p style="margin:0;font-size:12px;line-height:1.5;color:#8a96a3;">
                This email was sent by Droyal Mental Wellness.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
HTML;
}
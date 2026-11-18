"use client";

import { SITE_NAME, SITE_URL } from "@/lib/constants";

export default function PrivacyPolicyPage() {
  return (
    <>
      <head>
        <title>Privacy Policy | {SITE_NAME}</title>
        <meta
          name="description"
          content={`Read the privacy policy of ${SITE_NAME}. Learn how we handle your data and protect your privacy.`}
        />
        <link rel="canonical" href={`${SITE_URL}/privacy-policy`} />
      </head>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-extrabold mb-2">Privacy Policy</h1>
        <p className="text-sm text-[var(--muted)] mb-8">Last updated: November 2026</p>

        <div className="tool-card seo-content">
          <p>
            At {SITE_NAME}, we are committed to protecting your privacy. This Privacy Policy explains how we collect,
            use, and safeguard your information when you visit our website.
          </p>

          <h2>Information We Collect</h2>
          <p>
            {SITE_NAME} is designed to work entirely in your browser. We do <strong>not</strong> collect, store, or
            transmit any personal data you enter into our tools. All calculations and processing happen locally on your
            device.
          </p>
          <p>
            We may collect anonymous, non-personally identifiable information such as:
          </p>
          <ul>
            <li>Browser type and version</li>
            <li>Operating system</li>
            <li>Pages visited and time spent on pages</li>
            <li>Referring website</li>
            <li>General geographic location (country/city level)</li>
          </ul>

          <h2>How We Use Information</h2>
          <p>
            Any anonymous data we collect is used solely to:
          </p>
          <ul>
            <li>Improve our website and tools</li>
            <li>Understand usage patterns and popular tools</li>
            <li>Fix bugs and improve performance</li>
            <li>Ensure the security and integrity of our website</li>
          </ul>

          <h2>Cookies</h2>
          <p>
            We may use cookies and similar technologies for basic website functionality and analytics. Third-party
            services such as Google Analytics and Google AdSense may also set cookies. You can control cookie
            preferences through your browser settings.
          </p>

          <h2>Third-Party Services</h2>
          <p>
            We may use the following third-party services:
          </p>
          <ul>
            <li>
              <strong>Google Analytics:</strong> To understand website traffic and usage patterns. Google Analytics
              collects anonymous data. See{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--primary)] hover:underline"
              >
                Google&apos;s Privacy Policy
              </a>.
            </li>
            <li>
              <strong>Google AdSense:</strong> To display relevant advertisements. AdSense may use cookies to serve
              ads based on your browsing history. See{" "}
              <a
                href="https://policies.google.com/technologies/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--primary)] hover:underline"
              >
                Google Ad Technology Policy
              </a>.
            </li>
          </ul>

          <h2>Data Security</h2>
          <p>
            Since all tool calculations happen in your browser, your data never leaves your device. We take
            reasonable measures to protect the security and integrity of our website, but no method of internet
            transmission is 100% secure.
          </p>

          <h2>Children&apos;s Privacy</h2>
          <p>
            Our website is not directed at children under 13. We do not knowingly collect personal information
            from children. If you believe a child has provided us with personal information, please contact us
            and we will take steps to remove it.
          </p>

          <h2>Links to Other Websites</h2>
          <p>
            Our website may contain links to third-party websites. We are not responsible for the privacy practices
            or content of those websites. We encourage you to review their privacy policies.
          </p>

          <h2>Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Any changes will be posted on this page with
            an updated revision date. We encourage you to review this page periodically.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy or our practices, please contact us through our
            website.
          </p>
        </div>
      </div>
    </>
  );
}

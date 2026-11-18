"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Subnet Calculator - IP Subnet Mask & CIDR Calculator",
  description:
    "Free subnet calculator to compute network address, broadcast address, usable host range, wildcard mask, and number of hosts from any IP and CIDR notation.",
  keywords:
    "subnet calculator, ip subnet calculator, cidr calculator, subnet mask calculator, network calculator, ip address calculator, subnet mask to cidr",
};

function ipToLong(ip: string): number {
  const parts = ip.split(".").map(Number);
  return ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0;
}

function longToIp(long: number): string {
  return [
    (long >>> 24) & 255,
    (long >>> 16) & 255,
    (long >>> 8) & 255,
    long & 255,
  ].join(".");
}

function cidrToMask(cidr: number): number {
  return cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
}

function maskToCidr(mask: number): number {
  let bits = 0;
  let m = mask;
  while (m & 0x80000000) {
    bits++;
    m = (m << 1) >>> 0;
  }
  return bits;
}

function isValidIp(ip: string): boolean {
  const parts = ip.split(".");
  if (parts.length !== 4) return false;
  return parts.every((p) => {
    const n = Number(p);
    return !isNaN(n) && n >= 0 && n <= 255 && String(n) === p;
  });
}

const CIDR_TABLE = Array.from({ length: 25 }, (_, i) => {
  const cidr = i + 8;
  const mask = cidrToMask(cidr);
  const hosts = cidr >= 31 ? (cidr === 32 ? 1 : 2) : Math.pow(2, 32 - cidr) - 2;
  return {
    cidr: `/${cidr}`,
    mask: longToIp(mask),
    hosts,
    networks: cidr <= 24 ? Math.pow(2, cidr - 8) : Math.pow(2, cidr - 24),
  };
});

export default function SubnetCalculatorPage() {
  const [ipAddress, setIpAddress] = useState<string>("192.168.1.100");
  const [subnetInput, setSubnetInput] = useState<string>("24");
  const [inputMode, setInputMode] = useState<"cidr" | "mask">("cidr");
  const [showCidrTable, setShowCidrTable] = useState(false);
  const [result, setResult] = useState<{
    ipAddress: string;
    cidr: number;
    subnetMask: string;
    wildcardMask: string;
    networkAddress: string;
    broadcastAddress: string;
    firstHost: string;
    lastHost: string;
    usableHosts: number;
    totalAddresses: number;
    ipClass: string;
    ipType: string;
    binaryMask: string;
  } | null>(null);

  function calculate() {
    if (!isValidIp(ipAddress)) return;

    let cidr: number;
    if (inputMode === "cidr") {
      cidr = parseInt(subnetInput);
      if (isNaN(cidr) || cidr < 0 || cidr > 32) return;
    } else {
      if (!isValidIp(subnetInput)) return;
      cidr = maskToCidr(ipToLong(subnetInput));
    }

    const ipLong = ipToLong(ipAddress);
    const mask = cidrToMask(cidr);
    const wildcard = (~mask) >>> 0;
    const network = (ipLong & mask) >>> 0;
    const broadcast = (network | wildcard) >>> 0;
    const totalAddresses = Math.pow(2, 32 - cidr);
    const usableHosts = cidr >= 31 ? (cidr === 32 ? 1 : 2) : totalAddresses - 2;

    const firstHost = cidr >= 31 ? network : (network + 1) >>> 0;
    const lastHost = cidr >= 31 ? broadcast : (broadcast - 1) >>> 0;

    const firstOctet = (ipLong >>> 24) & 255;
    let ipClass = "A";
    if (firstOctet >= 224) ipClass = "E (Reserved)";
    else if (firstOctet >= 224) ipClass = "D (Multicast)";
    else if (firstOctet >= 192) ipClass = "C";
    else if (firstOctet >= 128) ipClass = "B";

    const isPrivate =
      (firstOctet === 10) ||
      (firstOctet === 172 && ((ipLong >>> 16) & 255) >= 16 && ((ipLong >>> 16) & 255) <= 31) ||
      (firstOctet === 192 && ((ipLong >>> 16) & 255) === 168);

    const binaryMask = Array.from({ length: 32 }, (_, i) => (mask >>> (31 - i)) & 1)
      .join("")
      .replace(/(.{8})/g, "$1.")
      .slice(0, -1);

    setResult({
      ipAddress,
      cidr,
      subnetMask: longToIp(mask),
      wildcardMask: longToIp(wildcard),
      networkAddress: longToIp(network),
      broadcastAddress: longToIp(broadcast),
      firstHost: longToIp(firstHost),
      lastHost: longToIp(lastHost),
      usableHosts,
      totalAddresses,
      ipClass,
      ipType: isPrivate ? "Private" : "Public",
      binaryMask,
    });
  }

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/subnet-calculator`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/subnet-calculator`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Subnet Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          Enter an IP address and subnet mask or CIDR notation to calculate network details including network address, broadcast address, usable host range, and more.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">IP Address</label>
              <input
                type="text"
                value={ipAddress}
                onChange={(e) => setIpAddress(e.target.value)}
                className="input-field"
                placeholder="e.g., 192.168.1.100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                {inputMode === "cidr" ? "CIDR Prefix (e.g., 24)" : "Subnet Mask"}
              </label>
              <input
                type="text"
                value={subnetInput}
                onChange={(e) => setSubnetInput(e.target.value)}
                className="input-field"
                placeholder={inputMode === "cidr" ? "e.g., 24" : "e.g., 255.255.255.0"}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Input Mode</label>
              <select
                value={inputMode}
                onChange={(e) => {
                  const mode = e.target.value as "cidr" | "mask";
                  setInputMode(mode);
                  setSubnetInput(mode === "cidr" ? "24" : "255.255.255.0");
                }}
                className="input-field"
              >
                <option value="cidr">CIDR Notation (/24)</option>
                <option value="mask">Subnet Mask</option>
              </select>
            </div>
          </div>

          <button onClick={calculate} className="btn-primary mt-6">
            Calculate Subnet
          </button>
        </div>

        {result && (
          <div className="mb-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Network Address</p>
                <p className="text-lg font-bold text-[var(--primary)]">{result.networkAddress}</p>
              </div>
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">Broadcast</p>
                <p className="text-lg font-bold">{result.broadcastAddress}</p>
              </div>
              <div className="result-card text-center" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <p className="text-sm text-[var(--muted)] mb-1">Usable Hosts</p>
                <p className="text-lg font-bold text-green-700">{result.usableHosts.toLocaleString()}</p>
              </div>
              <div className="result-card text-center">
                <p className="text-sm text-[var(--muted)] mb-1">IP Type</p>
                <p className="text-lg font-bold">{result.ipType}</p>
              </div>
            </div>

            <div className="tool-card mb-6">
              <h2 className="text-lg font-bold mb-4">Subnet Details</h2>
              <table className="w-full text-sm border-collapse">
                <tbody>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2 font-medium">IP Address</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-mono">{result.ipAddress}/{result.cidr}</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2 font-medium">Subnet Mask</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-mono">{result.subnetMask}</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2 font-medium">Wildcard Mask</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-mono">{result.wildcardMask}</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2 font-medium">Network Address</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-mono">{result.networkAddress}</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2 font-medium">Broadcast Address</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-mono">{result.broadcastAddress}</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2 font-medium">First Usable Host</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-mono">{result.firstHost}</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2 font-medium">Last Usable Host</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-mono">{result.lastHost}</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2 font-medium">Usable Hosts</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{result.usableHosts.toLocaleString()}</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2 font-medium">Total Addresses</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-semibold">{result.totalAddresses.toLocaleString()}</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2 font-medium">IP Class</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">Class {result.ipClass}</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2 font-medium">Binary Subnet Mask</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right font-mono text-xs">{result.binaryMask}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="tool-card mb-8 overflow-x-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">CIDR Reference Table</h2>
            <button
              onClick={() => setShowCidrTable(!showCidrTable)}
              className="text-sm text-[var(--primary)] hover:underline"
            >
              {showCidrTable ? "Hide Table" : "Show Table"}
            </button>
          </div>

          {showCidrTable && (
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[var(--muted-bg)]">
                  <th className="border border-[var(--card-border)] px-3 py-2 text-left">CIDR</th>
                  <th className="border border-[var(--card-border)] px-3 py-2 text-left">Subnet Mask</th>
                  <th className="border border-[var(--card-border)] px-3 py-2 text-right">Usable Hosts</th>
                </tr>
              </thead>
              <tbody>
                {CIDR_TABLE.map((row) => (
                  <tr key={row.cidr} className="hover:bg-[var(--muted-bg)]">
                    <td className="border border-[var(--card-border)] px-3 py-2 font-mono font-semibold">{row.cidr}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 font-mono">{row.mask}</td>
                    <td className="border border-[var(--card-border)] px-3 py-2 text-right">{row.hosts.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>What Is Subnetting?</h2>
          <p>
            Subnetting is the practice of dividing a network into smaller subnetworks (subnets). Each subnet has its own
            range of IP addresses, and subnetting helps optimize network performance, security, and IP address management.
          </p>

          <h2>Understanding CIDR Notation</h2>
          <p>
            CIDR (Classless Inter-Domain Routing) notation represents an IP address and its subnet mask. For example,
            192.168.1.0/24 means the first 24 bits are the network portion and the remaining 8 bits are for host addresses.
          </p>

          <h2>Key Subnet Concepts</h2>
          <ul>
            <li><strong>Network Address:</strong> The first address in the subnet, identifies the network itself</li>
            <li><strong>Broadcast Address:</strong> The last address in the subnet, used to send data to all hosts</li>
            <li><strong>Subnet Mask:</strong> Determines which portion of the IP is the network vs. host</li>
            <li><strong>Wildcard Mask:</strong> The inverse of the subnet mask, used in ACLs and OSPF</li>
          </ul>

          <h3>Private IP Address Ranges (RFC 1918)</h3>
          <ul>
            <li><strong>Class A:</strong> 10.0.0.0 to 10.255.255.255 (/8)</li>
            <li><strong>Class B:</strong> 172.16.0.0 to 172.31.255.255 (/12)</li>
            <li><strong>Class C:</strong> 192.168.0.0 to 192.168.255.255 (/16)</li>
          </ul>

          <h3>Common Subnet Masks</h3>
          <ul>
            <li><strong>/24</strong> (255.255.255.0) - 254 usable hosts - Most common for small networks</li>
            <li><strong>/16</strong> (255.255.0.0) - 65,534 usable hosts - Large networks</li>
            <li><strong>/8</strong> (255.0.0.0) - 16,777,214 usable hosts - Very large networks</li>
            <li><strong>/30</strong> (255.255.255.252) - 2 usable hosts - Point-to-point links</li>
          </ul>
        </div>
      </div>

      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Subnet Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/subnet-calculator`,
            applicationCategory: "DeveloperApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}

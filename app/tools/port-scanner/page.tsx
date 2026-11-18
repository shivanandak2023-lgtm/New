"use client";

import { useState, useMemo } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Port Scanner - Common Network Ports Reference & Search",
  description:
    "Comprehensive network ports reference with 100+ common ports. Search by port number, service name, or protocol. Filter by TCP/UDP. Copy port info instantly.",
  keywords: "port scanner, common ports, network ports, tcp ports, udp ports, port reference, port list",
};

interface PortInfo {
  port: number;
  protocol: string;
  service: string;
  description: string;
  category: string;
}

const PORTS_DATABASE: PortInfo[] = [
  { port: 20, protocol: "TCP", service: "FTP Data", description: "File Transfer Protocol data transfer", category: "File Transfer" },
  { port: 21, protocol: "TCP", service: "FTP Control", description: "File Transfer Protocol command control", category: "File Transfer" },
  { port: 22, protocol: "TCP", service: "SSH", description: "Secure Shell for encrypted remote access", category: "Remote Access" },
  { port: 23, protocol: "TCP", service: "Telnet", description: "Unencrypted remote access (insecure)", category: "Remote Access" },
  { port: 25, protocol: "TCP", service: "SMTP", description: "Simple Mail Transfer Protocol for sending email", category: "Email" },
  { port: 53, protocol: "TCP/UDP", service: "DNS", description: "Domain Name System for name resolution", category: "Core" },
  { port: 67, protocol: "UDP", service: "DHCP Server", description: "Dynamic Host Configuration Protocol server", category: "Core" },
  { port: 68, protocol: "UDP", service: "DHCP Client", description: "Dynamic Host Configuration Protocol client", category: "Core" },
  { port: 69, protocol: "UDP", service: "TFTP", description: "Trivial File Transfer Protocol", category: "File Transfer" },
  { port: 80, protocol: "TCP", service: "HTTP", description: "Hypertext Transfer Protocol for web traffic", category: "Web" },
  { port: 110, protocol: "TCP", service: "POP3", description: "Post Office Protocol v3 for retrieving email", category: "Email" },
  { port: 119, protocol: "TCP", service: "NNTP", description: "Network News Transfer Protocol", category: "Other" },
  { port: 123, protocol: "UDP", service: "NTP", description: "Network Time Protocol for clock sync", category: "Core" },
  { port: 135, protocol: "TCP", service: "MS RPC", description: "Microsoft Remote Procedure Call", category: "Windows" },
  { port: 137, protocol: "UDP", service: "NetBIOS Name", description: "NetBIOS Name Service", category: "Windows" },
  { port: 138, protocol: "UDP", service: "NetBIOS Datagram", description: "NetBIOS Datagram Service", category: "Windows" },
  { port: 139, protocol: "TCP", service: "NetBIOS Session", description: "NetBIOS Session Service / SMB", category: "Windows" },
  { port: 143, protocol: "TCP", service: "IMAP", description: "Internet Message Access Protocol for email", category: "Email" },
  { port: 161, protocol: "UDP", service: "SNMP", description: "Simple Network Management Protocol", category: "Monitoring" },
  { port: 162, protocol: "UDP", service: "SNMP Trap", description: "SNMP Trap notifications", category: "Monitoring" },
  { port: 179, protocol: "TCP", service: "BGP", description: "Border Gateway Protocol for internet routing", category: "Core" },
  { port: 194, protocol: "TCP", service: "IRC", description: "Internet Relay Chat", category: "Other" },
  { port: 389, protocol: "TCP", service: "LDAP", description: "Lightweight Directory Access Protocol", category: "Directory" },
  { port: 443, protocol: "TCP", service: "HTTPS", description: "HTTP Secure with TLS/SSL encryption", category: "Web" },
  { port: 445, protocol: "TCP", service: "SMB", description: "Server Message Block for file sharing", category: "Windows" },
  { port: 465, protocol: "TCP", service: "SMTPS", description: "SMTP over SSL for secure email sending", category: "Email" },
  { port: 514, protocol: "UDP", service: "Syslog", description: "System logging protocol", category: "Monitoring" },
  { port: 515, protocol: "TCP", service: "LPD", description: "Line Printer Daemon printing protocol", category: "Other" },
  { port: 520, protocol: "UDP", service: "RIP", description: "Routing Information Protocol", category: "Core" },
  { port: 543, protocol: "TCP", service: "Kerberos Login", description: "Kerberos authentication login", category: "Security" },
  { port: 544, protocol: "TCP", service: "Kerberos Shell", description: "Kerberos remote shell", category: "Security" },
  { port: 546, protocol: "UDP", service: "DHCPv6 Client", description: "DHCP for IPv6 client", category: "Core" },
  { port: 547, protocol: "UDP", service: "DHCPv6 Server", description: "DHCP for IPv6 server", category: "Core" },
  { port: 587, protocol: "TCP", service: "SMTP Submission", description: "Email message submission (with auth)", category: "Email" },
  { port: 636, protocol: "TCP", service: "LDAPS", description: "LDAP over SSL for secure directory access", category: "Directory" },
  { port: 853, protocol: "TCP", service: "DNS over TLS", description: "Encrypted DNS queries over TLS", category: "Core" },
  { port: 993, protocol: "TCP", service: "IMAPS", description: "IMAP over SSL for secure email access", category: "Email" },
  { port: 995, protocol: "TCP", service: "POP3S", description: "POP3 over SSL for secure email retrieval", category: "Email" },
  { port: 1080, protocol: "TCP", service: "SOCKS Proxy", description: "SOCKS proxy server", category: "Proxy" },
  { port: 1194, protocol: "UDP", service: "OpenVPN", description: "OpenVPN tunnel protocol", category: "VPN" },
  { port: 1433, protocol: "TCP", service: "MSSQL", description: "Microsoft SQL Server database", category: "Database" },
  { port: 1434, protocol: "UDP", service: "MSSQL Browser", description: "Microsoft SQL Server Browser service", category: "Database" },
  { port: 1521, protocol: "TCP", service: "Oracle DB", description: "Oracle database default listener", category: "Database" },
  { port: 1701, protocol: "UDP", service: "L2TP", description: "Layer 2 Tunneling Protocol", category: "VPN" },
  { port: 1723, protocol: "TCP", service: "PPTP", description: "Point-to-Point Tunneling Protocol VPN", category: "VPN" },
  { port: 1812, protocol: "UDP", service: "RADIUS Auth", description: "RADIUS authentication protocol", category: "Security" },
  { port: 1813, protocol: "UDP", service: "RADIUS Acct", description: "RADIUS accounting protocol", category: "Security" },
  { port: 1883, protocol: "TCP", service: "MQTT", description: "Message Queuing Telemetry Transport (IoT)", category: "IoT" },
  { port: 2049, protocol: "TCP", service: "NFS", description: "Network File System", category: "File Transfer" },
  { port: 2082, protocol: "TCP", service: "cPanel", description: "cPanel web hosting control panel", category: "Web" },
  { port: 2083, protocol: "TCP", service: "cPanel SSL", description: "cPanel over SSL", category: "Web" },
  { port: 2086, protocol: "TCP", service: "WHM", description: "WebHost Manager", category: "Web" },
  { port: 2087, protocol: "TCP", service: "WHM SSL", description: "WebHost Manager over SSL", category: "Web" },
  { port: 2181, protocol: "TCP", service: "ZooKeeper", description: "Apache ZooKeeper coordination service", category: "Big Data" },
  { port: 3000, protocol: "TCP", service: "Dev Server", description: "Common development server (Node, React)", category: "Development" },
  { port: 3306, protocol: "TCP", service: "MySQL", description: "MySQL / MariaDB database server", category: "Database" },
  { port: 3389, protocol: "TCP", service: "RDP", description: "Remote Desktop Protocol (Windows)", category: "Remote Access" },
  { port: 4443, protocol: "TCP", service: "Pharos", description: "Alternative HTTPS / Pharos", category: "Web" },
  { port: 5000, protocol: "TCP", service: "Flask/UPnP", description: "Python Flask dev server / UPnP", category: "Development" },
  { port: 5432, protocol: "TCP", service: "PostgreSQL", description: "PostgreSQL database server", category: "Database" },
  { port: 5672, protocol: "TCP", service: "RabbitMQ", description: "RabbitMQ message broker (AMQP)", category: "Messaging" },
  { port: 5900, protocol: "TCP", service: "VNC", description: "Virtual Network Computing remote desktop", category: "Remote Access" },
  { port: 5984, protocol: "TCP", service: "CouchDB", description: "Apache CouchDB database", category: "Database" },
  { port: 6379, protocol: "TCP", service: "Redis", description: "Redis in-memory data store", category: "Database" },
  { port: 6443, protocol: "TCP", service: "Kubernetes API", description: "Kubernetes API server", category: "Container" },
  { port: 6660, protocol: "TCP", service: "IRC Alt", description: "Alternative IRC port range start", category: "Other" },
  { port: 6667, protocol: "TCP", service: "IRC", description: "Internet Relay Chat standard port", category: "Other" },
  { port: 7474, protocol: "TCP", service: "Neo4j", description: "Neo4j graph database web interface", category: "Database" },
  { port: 8000, protocol: "TCP", service: "Dev Alt", description: "Alternative development server port", category: "Development" },
  { port: 8080, protocol: "TCP", service: "HTTP Proxy", description: "HTTP proxy / alternative web server", category: "Web" },
  { port: 8443, protocol: "TCP", service: "HTTPS Alt", description: "Alternative HTTPS port", category: "Web" },
  { port: 8883, protocol: "TCP", service: "MQTT SSL", description: "MQTT over SSL/TLS (IoT)", category: "IoT" },
  { port: 8888, protocol: "TCP", service: "Jupyter", description: "Jupyter Notebook default port", category: "Development" },
  { port: 9000, protocol: "TCP", service: "PHP-FPM", description: "PHP FastCGI Process Manager", category: "Web" },
  { port: 9042, protocol: "TCP", service: "Cassandra", description: "Apache Cassandra CQL native transport", category: "Database" },
  { port: 9090, protocol: "TCP", service: "Prometheus", description: "Prometheus monitoring system", category: "Monitoring" },
  { port: 9092, protocol: "TCP", service: "Kafka", description: "Apache Kafka message broker", category: "Messaging" },
  { port: 9200, protocol: "TCP", service: "Elasticsearch", description: "Elasticsearch REST API", category: "Database" },
  { port: 9300, protocol: "TCP", service: "Elasticsearch Transport", description: "Elasticsearch node communication", category: "Database" },
  { port: 9418, protocol: "TCP", service: "Git", description: "Git protocol for repository access", category: "Development" },
  { port: 11211, protocol: "TCP", service: "Memcached", description: "Memcached distributed caching", category: "Database" },
  { port: 15672, protocol: "TCP", service: "RabbitMQ Mgmt", description: "RabbitMQ management web UI", category: "Messaging" },
  { port: 25565, protocol: "TCP", service: "Minecraft", description: "Minecraft game server", category: "Gaming" },
  { port: 27017, protocol: "TCP", service: "MongoDB", description: "MongoDB NoSQL database server", category: "Database" },
  { port: 27018, protocol: "TCP", service: "MongoDB Shard", description: "MongoDB shard server", category: "Database" },
  { port: 27019, protocol: "TCP", service: "MongoDB Config", description: "MongoDB config server", category: "Database" },
  { port: 28015, protocol: "TCP", service: "RethinkDB", description: "RethinkDB client driver port", category: "Database" },
  { port: 33060, protocol: "TCP", service: "MySQL X", description: "MySQL X Protocol / Document Store", category: "Database" },
  { port: 44818, protocol: "TCP", service: "EtherNet/IP", description: "Industrial Ethernet protocol", category: "IoT" },
  { port: 47808, protocol: "UDP", service: "BACnet", description: "Building automation protocol", category: "IoT" },
  { port: 50000, protocol: "TCP", service: "DB2", description: "IBM DB2 database server", category: "Database" },
  { port: 51413, protocol: "TCP", service: "BitTorrent", description: "BitTorrent default port", category: "Other" },
];

export default function PortScannerPage() {
  const [search, setSearch] = useState("");
  const [protocolFilter, setProtocolFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [copiedPort, setCopiedPort] = useState<number | null>(null);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(PORTS_DATABASE.map((p) => p.category))).sort()],
    []
  );

  const filteredPorts = useMemo(() => {
    return PORTS_DATABASE.filter((p) => {
      const matchesSearch =
        !search ||
        p.port.toString().includes(search) ||
        p.service.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());

      const matchesProtocol =
        protocolFilter === "All" || p.protocol.includes(protocolFilter);

      const matchesCategory =
        categoryFilter === "All" || p.category === categoryFilter;

      return matchesSearch && matchesProtocol && matchesCategory;
    });
  }, [search, protocolFilter, categoryFilter]);

  function copyPortInfo(port: PortInfo) {
    navigator.clipboard.writeText(`Port ${port.port} (${port.protocol}) - ${port.service}: ${port.description}`);
    setCopiedPort(port.port);
    setTimeout(() => setCopiedPort(null), 2000);
  }

  function getCategoryColor(category: string): string {
    const colors: Record<string, string> = {
      "Web": "bg-blue-100 text-blue-700",
      "Database": "bg-green-100 text-green-700",
      "Email": "bg-purple-100 text-purple-700",
      "Core": "bg-red-100 text-red-700",
      "Remote Access": "bg-amber-100 text-amber-700",
      "Security": "bg-pink-100 text-pink-700",
      "File Transfer": "bg-cyan-100 text-cyan-700",
      "Windows": "bg-indigo-100 text-indigo-700",
      "Development": "bg-lime-100 text-lime-700",
      "Monitoring": "bg-orange-100 text-orange-700",
      "VPN": "bg-teal-100 text-teal-700",
      "Messaging": "bg-violet-100 text-violet-700",
      "Container": "bg-sky-100 text-sky-700",
      "IoT": "bg-emerald-100 text-emerald-700",
      "Gaming": "bg-rose-100 text-rose-700",
      "Big Data": "bg-fuchsia-100 text-fuchsia-700",
      "Directory": "bg-slate-100 text-slate-700",
      "Proxy": "bg-stone-100 text-stone-700",
    };
    return colors[category] || "bg-gray-100 text-gray-700";
  }

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/port-scanner`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/port-scanner`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Common Network Ports Reference</h1>
        <p className="text-[var(--muted)] mb-8">
          Search and explore 100+ common network ports with service names, protocols, and descriptions.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        {/* Search & Filters */}
        <div className="tool-card mb-8">
          <h2 className="text-lg font-bold mb-4">Search & Filter</h2>
          <div className="space-y-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by port number, service name, or description..."
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:outline-none bg-[var(--bg)] text-[var(--foreground)]"
            />

            <div className="flex flex-wrap gap-4">
              <div>
                <p className="text-sm font-medium mb-2">Protocol:</p>
                <div className="flex gap-2">
                  {["All", "TCP", "UDP"].map((p) => (
                    <button
                      key={p}
                      onClick={() => setProtocolFilter(p)}
                      className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                        protocolFilter === p
                          ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                          : "bg-[var(--bg)] text-[var(--foreground)] border-gray-300 hover:border-[var(--primary)]"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Category:</p>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-1 border rounded-lg bg-[var(--bg)] text-[var(--foreground)]"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <p className="text-sm text-[var(--muted)]">
              Showing {filteredPorts.length} of {PORTS_DATABASE.length} ports
            </p>
          </div>
        </div>

        {/* Quick Reference */}
        <div className="tool-card mb-8">
          <h2 className="text-lg font-bold mb-4">Most Common Ports</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { port: 22, service: "SSH", color: "#22c55e" },
              { port: 80, service: "HTTP", color: "#3b82f6" },
              { port: 443, service: "HTTPS", color: "#8b5cf6" },
              { port: 3306, service: "MySQL", color: "#f59e0b" },
              { port: 5432, service: "PostgreSQL", color: "#06b6d4" },
              { port: 6379, service: "Redis", color: "#ef4444" },
              { port: 27017, service: "MongoDB", color: "#10b981" },
              { port: 8080, service: "HTTP Proxy", color: "#f97316" },
            ].map((item) => (
              <div key={item.port} className="result-card text-center cursor-pointer hover:scale-105 transition-transform"
                onClick={() => setSearch(item.port.toString())}
              >
                <p className="text-2xl font-bold font-mono" style={{ color: item.color }}>{item.port}</p>
                <p className="text-xs text-[var(--muted)]">{item.service}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Ports Table */}
        <div className="tool-card mb-8">
          <h2 className="text-lg font-bold mb-4">Ports Directory</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="pb-2 pr-3">Port</th>
                  <th className="pb-2 pr-3">Protocol</th>
                  <th className="pb-2 pr-3">Service</th>
                  <th className="pb-2 pr-3">Category</th>
                  <th className="pb-2 pr-3">Description</th>
                  <th className="pb-2"></th>
                </tr>
              </thead>
              <tbody>
                {filteredPorts.map((p) => (
                  <tr key={`${p.port}-${p.protocol}`} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-2 pr-3 font-bold font-mono">{p.port}</td>
                    <td className="py-2 pr-3">
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        p.protocol === "TCP" ? "bg-blue-100 text-blue-700" :
                        p.protocol === "UDP" ? "bg-green-100 text-green-700" :
                        "bg-purple-100 text-purple-700"
                      }`}>
                        {p.protocol}
                      </span>
                    </td>
                    <td className="py-2 pr-3 font-medium">{p.service}</td>
                    <td className="py-2 pr-3">
                      <span className={`px-2 py-0.5 rounded text-xs ${getCategoryColor(p.category)}`}>
                        {p.category}
                      </span>
                    </td>
                    <td className="py-2 pr-3 text-[var(--muted)]">{p.description}</td>
                    <td className="py-2">
                      <button
                        onClick={() => copyPortInfo(p)}
                        className="text-xs text-[var(--primary)] hover:underline whitespace-nowrap"
                      >
                        {copiedPort === p.port ? "Copied!" : "Copy"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredPorts.length === 0 && (
            <p className="text-center text-[var(--muted)] py-8">
              No ports found matching your search. Try a different term.
            </p>
          )}
        </div>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>About Network Ports</h2>
          <p>
            Network ports are virtual endpoints for communication in a computer network. Each port is
            identified by a number (0-65535) and is associated with a specific protocol and service.
            Understanding common ports is essential for network administration, security, and troubleshooting.
          </p>

          <h2>Port Number Ranges</h2>
          <ul>
            <li><strong>0-1023:</strong> Well-known ports, assigned by IANA to common services</li>
            <li><strong>1024-49151:</strong> Registered ports, assigned by IANA for specific applications</li>
            <li><strong>49152-65535:</strong> Dynamic/private ports, used for temporary connections</li>
          </ul>

          <h2>TCP vs UDP</h2>
          <ul>
            <li><strong>TCP:</strong> Connection-oriented, reliable delivery with acknowledgment (HTTP, SSH, SMTP)</li>
            <li><strong>UDP:</strong> Connectionless, faster but no delivery guarantee (DNS, NTP, DHCP)</li>
          </ul>

          <h3>Security Best Practices</h3>
          <ul>
            <li><strong>Close Unused Ports:</strong> Only open ports that your services need</li>
            <li><strong>Use Firewalls:</strong> Configure firewall rules to restrict port access</li>
            <li><strong>Monitor Traffic:</strong> Watch for unexpected connections on known ports</li>
            <li><strong>Change Defaults:</strong> Consider running services on non-standard ports</li>
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
            name: "Common Network Ports Reference",
            description: META.description,
            url: `${SITE_URL}/tools/port-scanner`,
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}

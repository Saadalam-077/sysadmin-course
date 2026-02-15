import React, { useState } from 'react';

const LabLesson = ({ labNum, user, onNavigate, onExerciseComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showExercise, setShowExercise] = useState(false);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const Terminal = ({ commands }) => (
    <div className="bg-slate-900 rounded-xl border border-slate-700 overflow-hidden my-4">
      <div className="bg-slate-800 px-4 py-2 flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <span className="text-slate-400 text-sm ml-2 font-mono">root@server:~#</span>
      </div>
      <div className="p-4 font-mono text-sm overflow-x-auto">
        {commands.map((cmd, i) => (
          <div key={i} className="mb-1">
            {cmd.type === 'command' && <p className="text-cyan-400">$ {cmd.text}</p>}
            {cmd.type === 'root' && <p className="text-red-400"># {cmd.text}</p>}
            {cmd.type === 'output' && <p className="text-slate-300 whitespace-pre-wrap">{cmd.text}</p>}
            {cmd.type === 'comment' && <p className="text-slate-500"># {cmd.text}</p>}
            {cmd.type === 'file' && <p className="text-yellow-300 whitespace-pre-wrap">{cmd.text}</p>}
          </div>
        ))}
      </div>
    </div>
  );

  const labData = {
    1: {
      title: "Introduction to Systems Administration",
      titleAr: "مقدمة في إدارة الأنظمة",
      icon: "🖥️",
      videos: [{ id: "wBp0Rb-ZJak", title: "What is System Administration?" }, { id: "bYkgrKQW2WA", title: "Linux Sysadmin Basics" }],
      content: [
        { type: "intro", title: "Welcome to Lab 1", text: "Learn what Systems Administration is and the essential skills needed." },
        { type: "concept", title: "What is Systems Administration?", text: "Managing and maintaining computer systems:", points: ["Installing and configuring OS", "Managing users and security", "Monitoring system performance", "Performing backups", "Troubleshooting issues", "Automating tasks"] },
        { type: "concept", title: "Types of Sysadmins", text: "Specializations:", points: ["Linux Administrator", "Windows Administrator", "Network Administrator", "Database Administrator", "Cloud Administrator", "DevOps Engineer", "Security Administrator"] },
        { type: "code", title: "System Information Commands", commands: [
          { type: "command", text: "hostname" }, { type: "output", text: "server01.example.com" },
          { type: "command", text: "uname -a" }, { type: "output", text: "Linux server01 5.15.0 x86_64 GNU/Linux" },
          { type: "command", text: "cat /etc/os-release" }, { type: "output", text: "NAME=\"Ubuntu\"\nVERSION=\"22.04 LTS\"" },
          { type: "command", text: "uptime" }, { type: "output", text: "10:30 up 45 days, 2 users, load: 0.15" },
          { type: "command", text: "free -h" }, { type: "output", text: "        total   used   free\nMem:    7.7Gi   2.1Gi  5.1Gi" },
          { type: "command", text: "lscpu | head -5" }, { type: "command", text: "lsblk" }
        ]},
        { type: "practice", title: "🔬 Practice", tasks: ["Run hostname", "Run uname -a", "Run uptime", "Run free -h", "Run lscpu", "Run lsblk", "Run df -h"] }
      ],
      exercises: [
        { q: "Sysadmin is responsible for:", options: ["Only coding", "Managing systems", "Only hardware", "Only networking"], correct: 1 },
        { q: "Check uptime with:", options: ["runtime", "uptime", "sysup", "time"], correct: 1 },
        { q: "free -h shows:", options: ["Disk space", "Memory usage", "CPU info", "Network"], correct: 1 },
        { q: "lscpu shows:", options: ["Disk", "Memory", "CPU info", "Network"], correct: 2 },
        { q: "uname -a displays:", options: ["Users", "Kernel info", "Disk", "Network"], correct: 1 }
      ]
    },
    2: {
      title: "Linux Installation & Configuration",
      titleAr: "تثبيت وتكوين لينكس",
      icon: "💿",
      videos: [{ id: "sWbUDq4S6Y8", title: "Linux Installation" }, { id: "wBp0Rb-ZJak", title: "Post-Install Setup" }],
      content: [
        { type: "intro", title: "Welcome to Lab 2", text: "Learn Linux installation and essential post-installation configuration." },
        { type: "concept", title: "Installation Methods", text: "Ways to install Linux:", points: ["USB Boot - Physical servers", "Network Boot (PXE) - Mass deployment", "Virtual Machine - Testing", "Cloud Image - AWS, Azure", "Container - Docker"] },
        { type: "concept", title: "Partitioning", text: "Standard layout:", points: ["/ (root) - 20GB+", "/boot - 512MB", "/home - User data", "/var - Logs, 10GB+", "swap - 1-2x RAM"] },
        { type: "code", title: "Update System", commands: [
          { type: "root", text: "apt update" }, { type: "output", text: "Fetched 1,234 kB..." },
          { type: "root", text: "apt upgrade -y" },
          { type: "root", text: "apt autoremove -y" },
          { type: "root", text: "apt clean" }
        ]},
        { type: "code", title: "Configure Hostname", commands: [
          { type: "command", text: "hostname" }, { type: "output", text: "ubuntu" },
          { type: "root", text: "hostnamectl set-hostname server01.example.com" },
          { type: "command", text: "hostnamectl" }, { type: "output", text: "Static hostname: server01.example.com" }
        ]},
        { type: "code", title: "Configure Timezone", commands: [
          { type: "command", text: "timedatectl" },
          { type: "command", text: "timedatectl list-timezones | grep Asia" },
          { type: "root", text: "timedatectl set-timezone Asia/Riyadh" },
          { type: "command", text: "date" }, { type: "output", text: "Mon Feb 3 13:30:45 +03 2025" }
        ]},
        { type: "practice", title: "🔬 Practice", tasks: ["Run apt update && apt upgrade -y", "Run hostnamectl", "Run timedatectl", "Set timezone to Asia/Riyadh", "Run df -h", "Run lsblk"] }
      ],
      exercises: [
        { q: "Update package list:", options: ["apt upgrade", "apt update", "apt install", "apt refresh"], correct: 1 },
        { q: "Set hostname with:", options: ["hostname", "hostnamectl set-hostname", "sethostname", "namehost"], correct: 1 },
        { q: "/var stores:", options: ["Users", "Boot files", "Logs and data", "Binaries"], correct: 2 },
        { q: "Configure timezone:", options: ["datectl", "timedatectl", "tzconfig", "timezone"], correct: 1 },
        { q: "PXE is for:", options: ["Backup", "Network boot", "Monitoring", "Security"], correct: 1 }
      ]
    },
    3: {
      title: "User & Group Administration",
      titleAr: "إدارة المستخدمين والمجموعات",
      icon: "👥",
      videos: [{ id: "jwnvKOjmtEA", title: "User Management" }, { id: "19WOD6e5Rfs", title: "Users and Groups" }],
      content: [
        { type: "intro", title: "Welcome to Lab 3", text: "Master user and group management." },
        { type: "concept", title: "User Files", text: "Important files:", points: ["/etc/passwd - User info", "/etc/shadow - Passwords", "/etc/group - Groups", "/etc/skel - Home template"] },
        { type: "code", title: "Creating Users", commands: [
          { type: "root", text: "useradd -m -s /bin/bash john" },
          { type: "root", text: "passwd john" }, { type: "output", text: "New password: ****" },
          { type: "root", text: "useradd -m -s /bin/bash -c 'John Smith' -G sudo john2" },
          { type: "root", text: "adduser jane" }, { type: "comment", text: "Interactive creation" }
        ]},
        { type: "code", title: "Modifying Users", commands: [
          { type: "root", text: "usermod -aG sudo john" }, { type: "comment", text: "Add to sudo group" },
          { type: "root", text: "usermod -L john" }, { type: "comment", text: "Lock account" },
          { type: "root", text: "usermod -U john" }, { type: "comment", text: "Unlock account" },
          { type: "root", text: "chage -l john" }, { type: "comment", text: "View password aging" }
        ]},
        { type: "code", title: "Group Management", commands: [
          { type: "root", text: "groupadd developers" },
          { type: "root", text: "usermod -aG developers john" },
          { type: "command", text: "groups john" }, { type: "output", text: "john : john sudo developers" },
          { type: "command", text: "getent group developers" }, { type: "output", text: "developers:x:1001:john" },
          { type: "root", text: "groupdel developers" }
        ]},
        { type: "code", title: "Deleting Users", commands: [
          { type: "root", text: "userdel john" }, { type: "comment", text: "Keep home" },
          { type: "root", text: "userdel -r john" }, { type: "comment", text: "Remove home too" }
        ]},
        { type: "practice", title: "🔬 Practice", tasks: ["Create user: useradd -m -s /bin/bash testuser", "Set password: passwd testuser", "Create group: groupadd testgroup", "Add to group: usermod -aG testgroup testuser", "View: id testuser", "Delete: userdel -r testuser"] }
      ],
      exercises: [
        { q: "Passwords stored in:", options: ["/etc/passwd", "/etc/shadow", "/etc/users", "/etc/pass"], correct: 1 },
        { q: "Create user with home:", options: ["useradd", "useradd -m", "adduser -h", "mkuser"], correct: 1 },
        { q: "Add to group (keep others):", options: ["usermod -G", "usermod -aG", "usermod -g", "groupadd"], correct: 1 },
        { q: "Lock account:", options: ["usermod -L", "usermod -l", "passwd -l", "Both A and C"], correct: 3 },
        { q: "Delete user and home:", options: ["userdel", "userdel -r", "rmuser", "deluser"], correct: 1 }
      ]
    },
    4: {
      title: "File System Management",
      titleAr: "إدارة نظام الملفات",
      icon: "📁",
      videos: [{ id: "HbgzrKJvDRw", title: "Linux File System" }, { id: "A3G-3hp88mo", title: "Disk Management" }],
      content: [
        { type: "intro", title: "Welcome to Lab 4", text: "Learn disk and filesystem management." },
        { type: "concept", title: "File Systems", text: "Common types:", points: ["ext4 - Default Linux", "XFS - High performance", "Btrfs - Modern, snapshots", "NTFS - Windows", "swap - Virtual memory"] },
        { type: "code", title: "Viewing Disks", commands: [
          { type: "command", text: "lsblk" }, { type: "output", text: "NAME   SIZE TYPE MOUNTPOINTS\nsda    100G disk\n├─sda1 512M part /boot\n└─sda2  99G part /" },
          { type: "root", text: "fdisk -l /dev/sda" },
          { type: "command", text: "df -h" }, { type: "output", text: "Filesystem  Size  Used Avail Use% Mounted\n/dev/sda2    99G   15G   79G  16% /" },
          { type: "command", text: "du -sh /var/*" }
        ]},
        { type: "code", title: "Creating Filesystems", commands: [
          { type: "root", text: "mkfs.ext4 /dev/sdb1" },
          { type: "root", text: "mkfs.xfs /dev/sdb2" },
          { type: "root", text: "mkdir /mnt/data" },
          { type: "root", text: "mount /dev/sdb1 /mnt/data" },
          { type: "root", text: "umount /mnt/data" }
        ]},
        { type: "code", title: "Permanent Mounts", commands: [
          { type: "root", text: "blkid /dev/sdb1" }, { type: "output", text: "UUID=\"a1b2c3d4-...\" TYPE=\"ext4\"" },
          { type: "root", text: "nano /etc/fstab" },
          { type: "file", text: "UUID=a1b2c3d4-... /mnt/data ext4 defaults 0 2" },
          { type: "root", text: "mount -a" }, { type: "comment", text: "Test fstab" }
        ]},
        { type: "practice", title: "🔬 Practice", tasks: ["Run lsblk", "Run df -h", "Run du -sh /var/*", "Run blkid", "Run cat /etc/fstab"] }
      ],
      exercises: [
        { q: "Default Linux filesystem:", options: ["NTFS", "ext4", "FAT32", "HFS"], correct: 1 },
        { q: "df -h shows:", options: ["Directory sizes", "Disk usage", "Files", "Memory"], correct: 1 },
        { q: "Permanent mounts in:", options: ["/etc/mount", "/etc/fstab", "/etc/disks", "/etc/fs"], correct: 1 },
        { q: "Create ext4:", options: ["mkfs.ext4", "format.ext4", "newfs", "createfs"], correct: 0 },
        { q: "blkid shows:", options: ["Block size", "UUID and type", "Errors", "Mounts"], correct: 1 }
      ]
    },
    5: {
      title: "Package Management",
      titleAr: "إدارة الحزم",
      icon: "📦",
      videos: [{ id: "AJ_wLJXMhVU", title: "Package Management" }, { id: "MsD3FdHf0Go", title: "APT vs YUM" }],
      content: [
        { type: "intro", title: "Welcome to Lab 5", text: "Learn to install and manage software packages." },
        { type: "concept", title: "Package Managers", text: "By distribution:", points: ["APT - Debian/Ubuntu (.deb)", "DNF/YUM - RHEL/CentOS (.rpm)", "Pacman - Arch", "Snap/Flatpak - Universal"] },
        { type: "code", title: "APT (Ubuntu)", commands: [
          { type: "root", text: "apt update" },
          { type: "root", text: "apt upgrade -y" },
          { type: "command", text: "apt search nginx" },
          { type: "command", text: "apt show nginx" },
          { type: "root", text: "apt install nginx -y" },
          { type: "root", text: "apt remove nginx" },
          { type: "root", text: "apt purge nginx" }, { type: "comment", text: "Remove + config" },
          { type: "root", text: "apt autoremove" },
          { type: "command", text: "apt list --installed | head" }
        ]},
        { type: "code", title: "DNF (RHEL/CentOS)", commands: [
          { type: "root", text: "dnf update -y" },
          { type: "command", text: "dnf search httpd" },
          { type: "root", text: "dnf install httpd -y" },
          { type: "root", text: "dnf remove httpd" },
          { type: "command", text: "dnf list installed | head" }
        ]},
        { type: "practice", title: "🔬 Practice", tasks: ["Run apt update", "Run apt search htop", "Install: apt install htop -y", "Run htop (q to quit)", "Remove: apt remove htop", "Run apt autoremove"] }
      ],
      exercises: [
        { q: "Ubuntu uses:", options: ["YUM", "DNF", "APT", "Pacman"], correct: 2 },
        { q: "Update package list:", options: ["apt upgrade", "apt update", "apt refresh", "apt sync"], correct: 1 },
        { q: "Remove package + config:", options: ["apt remove", "apt purge", "apt delete", "apt uninstall"], correct: 1 },
        { q: "RHEL uses:", options: ["APT", "DNF/YUM", "Pacman", "Zypper"], correct: 1 },
        { q: "apt autoremove:", options: ["Updates", "Removes unused deps", "Lists", "Searches"], correct: 1 }
      ]
    },
    6: {
      title: "Service & Process Management",
      titleAr: "إدارة الخدمات والعمليات",
      icon: "⚙️",
      videos: [{ id: "5JVBpXiYMKo", title: "systemd" }, { id: "v_QR6xOw8CQ", title: "Process Management" }],
      content: [
        { type: "intro", title: "Welcome to Lab 6", text: "Manage services with systemd and control processes." },
        { type: "concept", title: "systemd", text: "Modern init system:", points: ["Manages services", "Handles dependencies", "Provides logging (journald)", "Controls system state"] },
        { type: "code", title: "Service Management", commands: [
          { type: "root", text: "systemctl status nginx" }, { type: "output", text: "● nginx.service - Active (running)" },
          { type: "root", text: "systemctl start nginx" },
          { type: "root", text: "systemctl stop nginx" },
          { type: "root", text: "systemctl restart nginx" },
          { type: "root", text: "systemctl reload nginx" },
          { type: "root", text: "systemctl enable nginx" }, { type: "comment", text: "Enable at boot" },
          { type: "root", text: "systemctl disable nginx" },
          { type: "command", text: "systemctl is-enabled nginx" }
        ]},
        { type: "code", title: "Listing Services", commands: [
          { type: "command", text: "systemctl list-units --type=service" },
          { type: "command", text: "systemctl --failed" },
          { type: "command", text: "systemctl list-dependencies nginx" }
        ]},
        { type: "code", title: "Process Management", commands: [
          { type: "command", text: "ps aux" },
          { type: "command", text: "top" }, { type: "comment", text: "q to quit" },
          { type: "command", text: "htop" },
          { type: "command", text: "pgrep -a nginx" }, { type: "output", text: "1234 nginx: master" },
          { type: "root", text: "kill 1234" },
          { type: "root", text: "kill -9 1234" }, { type: "comment", text: "Force kill" },
          { type: "root", text: "killall nginx" }
        ]},
        { type: "practice", title: "🔬 Practice", tasks: ["Run systemctl status ssh", "List services: systemctl list-units --type=service", "Check failed: systemctl --failed", "Run ps aux | head", "Run top (q to quit)"] }
      ],
      exercises: [
        { q: "Start service:", options: ["systemctl run", "systemctl start", "systemctl begin", "systemctl init"], correct: 1 },
        { q: "Enable at boot:", options: ["systemctl start", "systemctl enable", "systemctl boot", "systemctl auto"], correct: 1 },
        { q: "List failed:", options: ["systemctl failed", "systemctl --failed", "systemctl errors", "systemctl problems"], correct: 1 },
        { q: "Force kill:", options: ["kill", "kill -9", "kill -f", "kill --force"], correct: 1 },
        { q: "Real-time monitor:", options: ["ps", "top", "proc", "monitor"], correct: 1 }
      ]
    },
    7: {
      title: "Network Configuration",
      titleAr: "تكوين الشبكة",
      icon: "🌐",
      videos: [{ id: "9OKS7ZYgLnE", title: "Linux Networking" }, { id: "AuYNXgZm8Xk", title: "Network Config" }],
      content: [
        { type: "intro", title: "Welcome to Lab 7", text: "Configure network interfaces, IP, DNS, and routing." },
        { type: "code", title: "View Network Config", commands: [
          { type: "command", text: "ip addr" }, { type: "output", text: "2: eth0: inet 192.168.1.100/24" },
          { type: "command", text: "ip route" }, { type: "output", text: "default via 192.168.1.1 dev eth0" },
          { type: "command", text: "cat /etc/resolv.conf" }, { type: "output", text: "nameserver 8.8.8.8" }
        ]},
        { type: "code", title: "Temporary IP Config", commands: [
          { type: "root", text: "ip addr add 192.168.1.101/24 dev eth0" },
          { type: "root", text: "ip addr del 192.168.1.101/24 dev eth0" },
          { type: "root", text: "ip link set eth0 up" },
          { type: "root", text: "ip link set eth0 down" },
          { type: "root", text: "ip route add default via 192.168.1.1" }
        ]},
        { type: "code", title: "Netplan (Ubuntu)", commands: [
          { type: "root", text: "nano /etc/netplan/01-netcfg.yaml" },
          { type: "file", text: "network:\n  version: 2\n  ethernets:\n    eth0:\n      addresses: [192.168.1.100/24]\n      gateway4: 192.168.1.1\n      nameservers:\n        addresses: [8.8.8.8, 8.8.4.4]" },
          { type: "root", text: "netplan apply" }
        ]},
        { type: "code", title: "Troubleshooting", commands: [
          { type: "command", text: "ping -c 4 google.com" },
          { type: "command", text: "traceroute google.com" },
          { type: "command", text: "nslookup google.com" },
          { type: "command", text: "ss -tuln" }, { type: "output", text: "LISTEN 0.0.0.0:22" }
        ]},
        { type: "practice", title: "🔬 Practice", tasks: ["Run ip addr", "Run ip route", "Run cat /etc/resolv.conf", "Run ping -c 4 google.com", "Run ss -tuln", "Run nslookup google.com"] }
      ],
      exercises: [
        { q: "Show IP:", options: ["ifconfig", "ip addr", "ipconfig", "netstat"], correct: 1 },
        { q: "Ubuntu network config:", options: ["NetworkManager", "Netplan", "ifcfg", "network-scripts"], correct: 1 },
        { q: "Apply netplan:", options: ["netplan reload", "netplan apply", "netplan restart", "netplan start"], correct: 1 },
        { q: "Show open ports:", options: ["ss -tuln", "ports", "openports", "netstat -p"], correct: 0 },
        { q: "DNS lookup:", options: ["dns", "lookup", "nslookup", "dnsquery"], correct: 2 }
      ]
    },
    8: {
      title: "Security & Firewall",
      titleAr: "الأمان وجدار الحماية",
      icon: "🔒",
      videos: [{ id: "XtRXm1PW_MY", title: "Linux Security" }, { id: "kgdoVeyoO2E", title: "UFW Firewall" }],
      content: [
        { type: "intro", title: "Welcome to Lab 8", text: "Learn security practices and firewall configuration." },
        { type: "concept", title: "Security Best Practices", text: "Key measures:", points: ["Keep system updated", "Use strong passwords/SSH keys", "Disable root SSH login", "Configure firewall", "Use fail2ban", "Minimize packages"] },
        { type: "code", title: "UFW Firewall", commands: [
          { type: "root", text: "ufw status" }, { type: "output", text: "Status: inactive" },
          { type: "root", text: "ufw enable" },
          { type: "root", text: "ufw allow ssh" }, { type: "comment", text: "Important!" },
          { type: "root", text: "ufw allow 80/tcp" },
          { type: "root", text: "ufw allow 443/tcp" },
          { type: "root", text: "ufw allow from 192.168.1.100" },
          { type: "root", text: "ufw deny 23/tcp" },
          { type: "root", text: "ufw delete allow 80/tcp" },
          { type: "root", text: "ufw status numbered" }
        ]},
        { type: "code", title: "Securing SSH", commands: [
          { type: "root", text: "nano /etc/ssh/sshd_config" },
          { type: "file", text: "Port 2222\nPermitRootLogin no\nPasswordAuthentication no\nPubkeyAuthentication yes" },
          { type: "root", text: "systemctl restart sshd" }
        ]},
        { type: "code", title: "SSH Key Authentication", commands: [
          { type: "command", text: "ssh-keygen -t ed25519" }, { type: "output", text: "Generating key pair..." },
          { type: "command", text: "ssh-copy-id user@server" },
          { type: "command", text: "ssh user@server" }, { type: "comment", text: "No password needed" }
        ]},
        { type: "practice", title: "🔬 Practice", tasks: ["Run ufw status", "Run ufw allow ssh", "Run ufw enable", "Run ufw status numbered", "Run cat /etc/ssh/sshd_config | grep -i permit"] }
      ],
      exercises: [
        { q: "Enable UFW:", options: ["ufw start", "ufw enable", "ufw on", "ufw activate"], correct: 1 },
        { q: "Allow SSH:", options: ["ufw allow ssh", "ufw permit ssh", "ufw open ssh", "ufw accept ssh"], correct: 0 },
        { q: "Disable root SSH login:", options: ["PermitRootLogin yes", "PermitRootLogin no", "RootLogin no", "AllowRoot no"], correct: 1 },
        { q: "Generate SSH key:", options: ["ssh-key", "ssh-keygen", "keygen-ssh", "genkey"], correct: 1 },
        { q: "Show UFW rules with numbers:", options: ["ufw list", "ufw status numbered", "ufw rules", "ufw show"], correct: 1 }
      ]
    },
    9: {
      title: "Backup & Recovery",
      titleAr: "النسخ الاحتياطي والاستعادة",
      icon: "💾",
      videos: [{ id: "MsD3FdHf0Go", title: "Linux Backup Strategies" }, { id: "A3G-3hp88mo", title: "tar and rsync" }],
      content: [
        { type: "intro", title: "Welcome to Lab 9", text: "Learn backup strategies and tools for data protection." },
        { type: "concept", title: "Backup Types", text: "Different strategies:", points: ["Full Backup - Complete copy", "Incremental - Only changes since last backup", "Differential - Changes since last full backup", "Mirror - Exact copy", "Snapshot - Point-in-time copy"] },
        { type: "code", title: "tar - Archive Tool", commands: [
          { type: "comment", text: "Create compressed archive" },
          { type: "command", text: "tar -czvf backup.tar.gz /home/user" },
          { type: "comment", text: "Extract archive" },
          { type: "command", text: "tar -xzvf backup.tar.gz" },
          { type: "comment", text: "List contents" },
          { type: "command", text: "tar -tzvf backup.tar.gz" },
          { type: "comment", text: "Options: c=create, x=extract, z=gzip, v=verbose, f=file" }
        ]},
        { type: "code", title: "rsync - Sync Tool", commands: [
          { type: "comment", text: "Sync directories locally" },
          { type: "command", text: "rsync -avh /source/ /backup/" },
          { type: "comment", text: "Sync to remote server" },
          { type: "command", text: "rsync -avh -e ssh /source/ user@server:/backup/" },
          { type: "comment", text: "Delete files not in source" },
          { type: "command", text: "rsync -avh --delete /source/ /backup/" },
          { type: "comment", text: "Options: a=archive, v=verbose, h=human-readable" }
        ]},
        { type: "code", title: "Automated Backups (Cron)", commands: [
          { type: "root", text: "crontab -e" },
          { type: "file", text: "# Daily backup at 2 AM\n0 2 * * * /usr/local/bin/backup.sh\n\n# Weekly backup Sunday at 3 AM\n0 3 * * 0 tar -czvf /backup/weekly-$(date +%Y%m%d).tar.gz /home" },
          { type: "command", text: "crontab -l" }, { type: "comment", text: "List cron jobs" }
        ]},
        { type: "practice", title: "🔬 Practice", tasks: ["Create archive: tar -czvf test.tar.gz /etc/hosts", "List contents: tar -tzvf test.tar.gz", "Extract: tar -xzvf test.tar.gz", "Sync dirs: rsync -avh /tmp/src/ /tmp/dst/", "View cron: crontab -l"] }
      ],
      exercises: [
        { q: "Create tar.gz archive:", options: ["tar -xzvf", "tar -czvf", "tar -tzvf", "tar -rzvf"], correct: 1 },
        { q: "Extract archive:", options: ["tar -czvf", "tar -xzvf", "tar -tzvf", "tar -dzvf"], correct: 1 },
        { q: "rsync -a means:", options: ["All files", "Archive mode", "Automatic", "Async"], correct: 1 },
        { q: "Schedule daily backup:", options: ["0 2 * * *", "* * * * *", "0 0 1 * *", "0 0 * * 0"], correct: 0 },
        { q: "List cron jobs:", options: ["cron -l", "crontab -l", "crontab list", "cron list"], correct: 1 }
      ]
    },
    10: {
      title: "Monitoring & Troubleshooting",
      titleAr: "المراقبة واستكشاف الأخطاء",
      icon: "📊",
      videos: [{ id: "9OKS7ZYgLnE", title: "System Monitoring" }, { id: "bYkgrKQW2WA", title: "Troubleshooting Linux" }],
      content: [
        { type: "intro", title: "Welcome to Lab 10", text: "Learn to monitor system health and troubleshoot issues." },
        { type: "code", title: "System Monitoring", commands: [
          { type: "command", text: "top" }, { type: "comment", text: "Real-time processes" },
          { type: "command", text: "htop" }, { type: "comment", text: "Better alternative" },
          { type: "command", text: "vmstat 1 5" }, { type: "comment", text: "Memory/CPU stats" },
          { type: "command", text: "iostat 1 5" }, { type: "comment", text: "Disk I/O stats" },
          { type: "command", text: "sar -u 1 5" }, { type: "comment", text: "CPU usage history" }
        ]},
        { type: "code", title: "Log Analysis", commands: [
          { type: "comment", text: "View system logs" },
          { type: "root", text: "journalctl -xe" },
          { type: "comment", text: "Follow logs in real-time" },
          { type: "root", text: "journalctl -f" },
          { type: "comment", text: "View specific service logs" },
          { type: "root", text: "journalctl -u nginx" },
          { type: "comment", text: "View traditional logs" },
          { type: "command", text: "tail -f /var/log/syslog" },
          { type: "command", text: "tail -f /var/log/auth.log" },
          { type: "command", text: "grep 'error' /var/log/syslog" }
        ]},
        { type: "code", title: "Disk & Memory Check", commands: [
          { type: "command", text: "df -h" }, { type: "comment", text: "Disk space" },
          { type: "command", text: "du -sh /var/*" }, { type: "comment", text: "Directory sizes" },
          { type: "command", text: "free -h" }, { type: "comment", text: "Memory usage" },
          { type: "command", text: "cat /proc/meminfo" },
          { type: "root", text: "dmesg | tail" }, { type: "comment", text: "Kernel messages" }
        ]},
        { type: "code", title: "Network Troubleshooting", commands: [
          { type: "command", text: "ping -c 4 8.8.8.8" },
          { type: "command", text: "traceroute google.com" },
          { type: "command", text: "ss -tuln" }, { type: "comment", text: "Open ports" },
          { type: "command", text: "netstat -an | grep ESTABLISHED" },
          { type: "root", text: "tcpdump -i eth0 port 80" }, { type: "comment", text: "Packet capture" }
        ]},
        { type: "practice", title: "🔬 Practice", tasks: ["Run top (q to quit)", "Run free -h", "Run df -h", "Run journalctl -xe | head -50", "Run tail -20 /var/log/syslog", "Run ss -tuln", "Run vmstat 1 5"] }
      ],
      exercises: [
        { q: "View system logs:", options: ["syslog", "journalctl", "logs", "viewlog"], correct: 1 },
        { q: "Follow logs real-time:", options: ["journalctl -f", "journalctl -r", "journalctl -l", "journalctl -t"], correct: 0 },
        { q: "Check disk space:", options: ["du -h", "df -h", "disk -h", "space -h"], correct: 1 },
        { q: "Kernel messages:", options: ["kernel", "dmesg", "kmsg", "syslog"], correct: 1 },
        { q: "Memory stats:", options: ["mem", "free -h", "memory", "ram"], correct: 1 }
      ]
    }
  };

  const lab = labData[labNum];
  if (!lab) return <div className="min-h-screen bg-slate-900 flex items-center justify-center"><div className="text-center text-white"><p>Lab {labNum} coming soon!</p><button onClick={() => onNavigate('home')} className="mt-4 px-6 py-2 bg-cyan-600 rounded-lg">Back</button></div></div>;

  const totalSteps = lab.content.length + 2;
  const handleAnswer = (qi, ai) => { if (!submitted) setAnswers({...answers, [qi]: ai}); };
  const handleSubmit = () => { let c = 0; lab.exercises.forEach((e, i) => { if (answers[i] === e.correct) c++; }); const s = Math.round((c / lab.exercises.length) * 100); setScore(s); setSubmitted(true); onExerciseComplete(labNum, s); };

  if (showExercise) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-900/30 to-slate-900 text-white p-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-6">Lab {labNum} Exercise</h2>
          {!submitted ? (
            <div className="space-y-6">
              {lab.exercises.map((ex, i) => (
                <div key={i} className="bg-slate-700/30 rounded-xl p-4">
                  <p className="font-semibold mb-3">{i+1}. {ex.q}</p>
                  <div className="space-y-2">{ex.options.map((opt, j) => (
                    <button key={j} onClick={() => handleAnswer(i, j)} className={`w-full text-left px-4 py-2 rounded-lg ${answers[i] === j ? 'bg-cyan-600' : 'bg-slate-800 hover:bg-slate-700'}`}>{String.fromCharCode(65+j)}. {opt}</button>
                  ))}</div>
                </div>
              ))}
              <button onClick={handleSubmit} disabled={Object.keys(answers).length < 5} className="w-full py-3 bg-emerald-600 rounded-xl font-bold disabled:opacity-50">Submit</button>
            </div>
          ) : (
            <div className="text-center">
              <div className={`p-8 rounded-2xl mb-6 ${score >= 60 ? 'bg-emerald-900/30' : 'bg-red-900/30'}`}>
                <p className="text-5xl mb-2">{score >= 60 ? '🎉' : '😔'}</p>
                <p className="text-4xl font-bold">{score}%</p>
              </div>
              <div className="space-y-3 mb-6 text-left">{lab.exercises.map((ex, i) => (
                <div key={i} className={`p-3 rounded-lg ${answers[i] === ex.correct ? 'bg-emerald-900/30' : 'bg-red-900/30'}`}>
                  <p>{i+1}. {ex.q}</p>
                  <p className="text-sm">{answers[i] === ex.correct ? '✓ Correct' : `✗ Answer: ${ex.options[ex.correct]}`}</p>
                </div>
              ))}</div>
              <button onClick={() => onNavigate('home')} className="px-6 py-3 bg-cyan-600 rounded-xl">Back to Course</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  const renderContent = () => {
    if (currentStep === lab.content.length) {
      return (<div className="p-6"><h2 className="text-2xl font-bold text-center mb-6">Video Tutorials</h2><div className="space-y-6 max-w-3xl mx-auto">{lab.videos.map((v, i) => (<div key={i} className="bg-slate-700/30 rounded-xl overflow-hidden"><div className="aspect-video"><iframe src={`https://www.youtube.com/embed/${v.id}`} title={v.title} className="w-full h-full" allowFullScreen></iframe></div><p className="p-3 font-semibold">{v.title}</p></div>))}</div></div>);
    }
    if (currentStep === lab.content.length + 1) {
      return (<div className="p-6 text-center"><p className="text-5xl mb-4">✅</p><h2 className="text-2xl font-bold mb-2">Lab Complete!</h2><button onClick={() => setShowExercise(true)} className="px-8 py-4 bg-emerald-600 rounded-xl font-bold text-lg">Start Exercise</button></div>);
    }
    const c = lab.content[currentStep];
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <span className="px-3 py-1 bg-cyan-600/30 rounded-full text-cyan-300 text-sm">{c.type === 'code' ? '💻 Terminal' : c.type === 'practice' ? '🔬 Practice' : '📖 Concept'}</span>
          <h2 className="text-2xl font-bold mt-4">{c.title}</h2>
        </div>
        {c.text && <div className="bg-slate-700/30 rounded-xl p-6 mb-6"><p>{c.text}</p></div>}
        {c.points && <div className="bg-slate-700/30 rounded-xl p-6 mb-6">{c.points.map((p, i) => <p key={i} className="mb-2">• {p}</p>)}</div>}
        {c.commands && <Terminal commands={c.commands} />}
        {c.tasks && <div className="bg-cyan-900/20 rounded-xl p-6 border border-cyan-500/30"><h3 className="text-cyan-400 font-bold mb-3">Tasks to complete:</h3>{c.tasks.map((t, i) => <p key={i} className="mb-1 font-mono text-sm">→ {t}</p>)}</div>}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-900/30 to-slate-900 text-white flex flex-col">
      <header className="bg-slate-800/80 border-b border-slate-700 p-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => onNavigate('home')} className="px-3 py-2 bg-slate-700 rounded-lg">← Back</button>
            <div><h1 className="font-bold">Lab {labNum}: {lab.title}</h1><p className="text-xs text-cyan-300/70 font-arabic">{lab.titleAr}</p></div>
          </div>
          <span className="text-3xl">{lab.icon}</span>
        </div>
      </header>
      <div className="bg-slate-800/50 border-b border-slate-700 px-4 py-2">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between text-xs text-slate-400 mb-1"><span>Step {currentStep + 1} / {totalSteps}</span><span>{Math.round(((currentStep+1)/totalSteps)*100)}%</span></div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden"><div className="h-full bg-cyan-500 transition-all" style={{width: `${((currentStep+1)/totalSteps)*100}%`}}></div></div>
        </div>
      </div>
      <div className="flex-1">{renderContent()}</div>
      <div className="bg-slate-800/80 border-t border-slate-700 p-4 sticky bottom-0">
        <div className="max-w-6xl mx-auto flex justify-between">
          <button onClick={() => setCurrentStep(Math.max(0, currentStep-1))} disabled={currentStep === 0} className={`px-6 py-2 rounded-lg ${currentStep === 0 ? 'bg-slate-700 text-slate-500' : 'bg-slate-700 hover:bg-slate-600'}`}>← Previous</button>
          {currentStep < totalSteps - 1 ? (<button onClick={() => setCurrentStep(currentStep+1)} className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg">Next →</button>) : (<button onClick={() => setShowExercise(true)} className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg">Take Exercise</button>)}
        </div>
      </div>
    </div>
  );
};

export default LabLesson;

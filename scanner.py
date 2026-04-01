import sys
import requests
import os
import time
import socket
from urllib.parse import urlparse

# Handle emoji printing in windows terminal
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# Enable beautiful text colors on Windows terminal
if os.name == 'nt':
    os.system('')

class Colors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'

SECURITY_HEADERS = {
    'Strict-Transport-Security': 'Protects against man-in-the-middle attacks (HTTPS enforcement)',
    'Content-Security-Policy': 'Prevents Cross-Site Scripting (XSS) and data injection attacks',
    'X-Frame-Options': 'Protects against Clickjacking (someone framing your site)',
    'X-Content-Type-Options': 'Prevents MIME-sniffing and unexpected code execution',
    'Referrer-Policy': 'Protects user privacy by restricting referrer information sent to other sites',
    'Permissions-Policy': 'Restricts which browser features (camera, mic) the site can use'
}

def scan_url(url):
    print(f"\n{Colors.HEADER}{Colors.BOLD}🛡️  SITESHIELD PRO SCANNER (ADVANCED MODE){Colors.ENDC}")
    print(f"{Colors.OKCYAN}Target URL:{Colors.ENDC} {url}")
    print("-------------------------------------------\n")
    
    # Pre-process URL
    if not url.startswith('http'):
        url = 'http://' + url

    time.sleep(1) # Dramatic pause

    try:
        passed_checks = []
        failed_checks = []

        # --- 1. SSL / TLS Check ---
        print(f"{Colors.OKBLUE}[1/4] Verifying SSL/TLS Certificate...{Colors.ENDC}")
        try:
            https_url = url.replace('http://', 'https://') if url.startswith('http://') else url
            requests.get(https_url, timeout=5)
            passed_checks.append(('SSL/TLS Certificate', 'Traffic is encrypted and secure.'))
            url = https_url
        except requests.exceptions.SSLError:
            failed_checks.append(('SSL/TLS Certificate', 'Missing or Invalid SSL. Passwords and data are sent in plain-text!'))
        except requests.exceptions.RequestException:
            failed_checks.append(('HTTPS Not Enabled', 'Server does not support secure HTTPS connections.'))

        # --- 2. Headers Check ---
        print(f"{Colors.OKBLUE}[2/4] Scanning security headers...{Colors.ENDC}")
        response = requests.get(url, timeout=10)
        headers = response.headers
        
        for header, description in SECURITY_HEADERS.items():
            if any(k.lower() == header.lower() for k in headers.keys()):
                passed_checks.append(('Header: ' + header, description))
            else:
                failed_checks.append(('Header: ' + header, description))
                
        # --- 3. Sensitive Files Check ---
        print(f"{Colors.OKBLUE}[3/4] Hunting for exposed sensitive files...{Colors.ENDC}")
        sensitive_files = ['/.git/config', '/wp-login.php', '/.env', '/composer.json']
        for file in sensitive_files:
            try:
                # We do a quick head/get request
                file_url = url.rstrip('/') + file
                res = requests.get(file_url, timeout=1.5, allow_redirects=False)
                if res.status_code == 200:
                    failed_checks.append(('Exposed File: ' + file, 'CRITICAL: Configuration or admin file is publicly accessible!'))
                else:
                    passed_checks.append(('File Security: ' + file, 'Safely hidden or missing.'))
            except:
                pass

        # --- 4. Open Port Scanning ---
        print(f"{Colors.OKBLUE}[4/4] Scanning server ports for vulnerabilities...{Colors.ENDC}\n")
        domain = urlparse(url).netloc or urlparse(url).path
        ports_to_check = {21: 'FTP', 22: 'SSH', 3306: 'MySQL Database'}
        for port, service in ports_to_check.items():
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(0.5)
            try:
                result = sock.connect_ex((domain, port))
                if result == 0:
                    failed_checks.append((f'Open Port: {port} ({service})', 'WARNING: Dangerous port exposed to the public internet.'))
                else:
                    passed_checks.append((f'Port {port} Closed', 'Secure from public access.'))
            except Exception:
                 pass
            finally:
                 sock.close()
                
        # --- Print Results ---
        if passed_checks:
            print(f"{Colors.OKGREEN}{Colors.BOLD}✅ SECURE CONFIGURATIONS FOUND:{Colors.ENDC}")
            for item, _ in passed_checks:
                print(f" {Colors.OKGREEN}[+]{Colors.ENDC} {item}")
            print("\n")

        if failed_checks:
            print(f"{Colors.FAIL}{Colors.BOLD}❌ VULNERABILITIES FOUND (CRITICAL):{Colors.ENDC}")
            print(f"{Colors.FAIL}These misconfigurations leave the site open to hacking:{Colors.ENDC}\n")
            for item, desc in failed_checks:
                 print(f" {Colors.FAIL}[-]{Colors.ENDC} {Colors.BOLD}{item}{Colors.ENDC}")
                 print(f"     -> {Colors.WARNING}{desc}{Colors.ENDC}")
        
        # --- Calculate Grade ---
        total_checks = len(passed_checks) + len(failed_checks)
        score = len(passed_checks) / total_checks if total_checks > 0 else 0
        
        print("\n-------------------------------------------")
        if score > 0.9:
            print(f"{Colors.OKGREEN}{Colors.BOLD}FINAL GRADE: A (Highly Secure){Colors.ENDC}")
            print("Action: No action needed.")
        elif score >= 0.7:
            print(f"{Colors.WARNING}{Colors.BOLD}FINAL GRADE: C (Needs Improvement){Colors.ENDC}")
            print("Action: Review missing headers and patch immediately.")
        elif score >= 0.4:
            print(f"{Colors.FAIL}{Colors.BOLD}FINAL GRADE: D (Vulnerable - At Risk){Colors.ENDC}")
            print("Action: Severe missing configs. Immediate fix required to prevent data loss.")
        else:
            print(f"{Colors.FAIL}{Colors.BOLD}FINAL GRADE: F (Highly Insecure){Colors.ENDC}")
            print("Action: Website is incredibly vulnerable. Immediate lock-down required.")
        print("-------------------------------------------\n")

    except requests.exceptions.RequestException as e:
         print(f"{Colors.FAIL}❌ Failed to scan website. It might be down or not responding.{Colors.ENDC}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(f"{Colors.WARNING}Usage: python scanner.py <website_url>{Colors.ENDC}")
        sys.exit(1)
        
    target_url = sys.argv[1]
    scan_url(target_url)

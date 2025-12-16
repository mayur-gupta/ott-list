# Deployment Specification: OTT My List API on AWS Free Tier

## 1. Executive Summary
This document specifies the procedure to deploy the "OTT My List" backend application, including its MongoDB and Redis dependencies, to an **AWS Free Tier EC2 instance**.

**Target Infrastructure:**
- **Provider:** AWS Free Tier (Amazon EC2).
- **Instance Type:** `t2.micro` or `t3.micro` (1 vCPU, 1GB RAM).
- **OS:** Ubuntu Server 22.04 LTS (HVM), SSD Volume Type.
- **Architecture:** Docker Compose (Application + MongoDB + Redis).
- **Code Source:** [https://github.com/mayur-gupta/ott-list](https://github.com/mayur-gupta/ott-list)

---

## 2. Infrastructure Provisioning

### 2.1 Launch EC2 Instance
1.  **Login to AWS Console** and navigate to **EC2**.
2.  **Launch Instance:**
    - **Name:** `ott-mylist-server`
    - **AMI (OS Image):** Ubuntu Server 22.04 LTS (HVM), SSD Volume Type (Free tier eligible).
    - **Instance Type:** `t2.micro` or `t3.micro` (Free tier eligible).
    - **Key Pair (Login):**
        - **CRITICAL WARNING:** Do **NOT** select "Proceed without a key pair". If you do this, you will be permanently locked out of your server and must create a new one.
        - Click "Create new key pair".
        - Name: `ott-key` (or similar).
        - Type: `RSA`.
        - Private key file format: `.pem`.
        - **Click "Create key pair"**: This will **immediately download** a file named `ott-key.pem` to your computer's **Downloads** folder.
        - **IMPORTANT:** Move this file to a safe folder on your computer (e.g., `C:\Users\YourName\.ssh\` or just your Desktop). You cannot download it again later.
3.  **Network Settings (Security Group):**
    - Create a **New Security Group**.
    - **Add Inbound Security Group Rules:**
        - **SSH:** Type: `SSH`, Port: `22`, Source: `My IP` (Recommended for security) or `0.0.0.0/0`.
        - **Custom TCP:** Port: `3000`, Source: `0.0.0.0/0` (Allows public access to API).
4.  **Storage:** Default (8 GiB gp2/gp3) is sufficient.
5.  **Launch Instance**.

### 2.2 SSH Access
1.  Open your local terminal (PowerShell or Command Prompt).
2.  Navigate to the folder where you saved `ott-key.pem`.
    ```powershell
    cd C:\Users\YourName\Desktop  # Example path
    ```
3.  **Windows Users:** standard permissions usually work fine.
    **Mac/Linux Users:** Run `chmod 400 ott-key.pem`.
4.  Connect to the instance using its **Public IPv4 address** (found in AWS Console):
    ```powershell
    ssh -i "ott-key.pem" ubuntu@<EC2_PUBLIC_IP>
    ```

---

## 3. Server Configuration & Dependencies

### 3.1 System Updates
Once logged in, update the package lists:
```bash
sudo apt-get update && sudo apt-get upgrade -y
```

### 3.2 Install Docker & Docker Compose
Install the Docker engine and the Docker Compose plugin:
```bash
# Add Docker's official GPG key:
sudo apt-get install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# Add the repository to Apt sources:
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install packages
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Verify installation
sudo docker compose version
```

---

## 4. Application Deployment

### 4.1 Code Setup
1.  **Clone Repository:**
    ```bash
    git clone https://github.com/mayur-gupta/ott-list.git
    cd ott-list
    ```

2.  **Environment Configuration:**
    Create the `.env` file for production.
    ```bash
    nano .env
    ```
    **Paste the following content** (this configures the app to talk to the local Docker containers):
    ```env
    NODE_ENV=production
    PORT=3000
    
    # Internal Docker Network URLs
    MONGODB_URI=mongodb://mongodb:27017/ott-mylist
    REDIS_HOST=redis
    REDIS_PORT=6379
    
    # Feature Flags
    CACHE_ENABLED=true
    ```
    *(Press `Ctrl+X`, then `Y`, then `Enter` to save)*

### 4.2 Build and Launch
Run the application in detached mode:
```bash
sudo docker compose up -d --build
```
*Note: On t2.micro instances with 1GB RAM, `npm install` inside the build sometimes hangs. If this happens, your instance may need swap space (see Troubleshooting).*

---

## 5. Verification & Testing

### 5.1 Service Status
Check if all containers are running successfully:
```bash
sudo docker compose ps
```
*Expected Output: `ott-mylist-api`, `ott-mongodb`, and `ott-redis` should all have status `Up`.*

### 5.2 Public Access Test
Open a web browser and navigate to the **HTTP** URL (do **NOT** use HTTPS):
- **API Health:** `http://<EC2_PUBLIC_IP>:3000/api/health`
- **Swagger Documentation:** `http://<EC2_PUBLIC_IP>:3000/api-docs`

**Note:** If your browser auto-redirects to HTTPS, it will fail. Ensure the address bar explicitly says `http://`.

### 5.3 **(Optional)** Seed Database
To populate the database with sample data:
```bash
sudo docker compose exec app npm run seed:prod
```
*Note: This command runs inside the container and uses the production-built script.*

---

## 6. Maintenance & Troubleshooting

### 6.1 Security Group (Firewall) Issues
**Symptom:** "Site can't be reached" on Port 3000.
**Fix (Switch to Port 80):**
Port 3000 is sometimes blocked by strict firewalls. It is safer to use the standard Web Port 80.

1.  **AWS Console:** Add Inbound Rule for **HTTP** (Port 80) -> Source `0.0.0.0/0`.
2.  **Server:** Edit `docker-compose.yml`:
    ```yaml
    app:
      ports:
        - "80:3000"  # CHANGE THIS LINE (was 3000:3000)
    ```
3.  **Apply Change:**
    ```bash
    sudo docker compose up -d
    ```
4.  **Test:** Open `http://<EC2_IP>/api/v1/health` (No port number needed now).

### 6.2 View Logs
To view logs for the API service:
```bash
sudo docker compose logs -f app
```

### 6.2 Low Memory Issues (Swap File)
If the build crashes or MongoDB gets killed due to OOM (Out of Memory) on the free tier instance:
```bash
# Create a 2GB swap file
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
# Make permanent
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```
After adding swap, try `sudo docker compose up -d --build` again.

### 6.3 Server Restart (Fix for "No Configuration File" Error)
If you reboot the EC2 instance, you will be logged in at `/home/ubuntu`.
You must navigate back to the project folder before running Docker commands:

1.  Log in via SSH.
2.  **Navigate to Project:**
    ```bash
    cd ott-list
    ```
3.  **Run Commands:**
    ```bash
    sudo docker compose ps
    sudo docker compose up -d
    ```

# Deployment Guide

## Production Deployment

This guide covers deploying the Suits In platform to production.

## Prerequisites

- Docker & Docker Compose
- Cloud hosting (AWS, Azure, GCP, etc.)
- PostgreSQL managed service
- SSL/TLS certificate
- Domain name

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CDN (CloudFront/Azure CDN)              │
└──────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    Load Balancer (SSL Termination)              │
│              (ALB/Azure LB/GCP Load Balancer)                  │
└──────────────────────────────────────────────────────────────────┘
        ↓                                           ↓
┌──────────────────────────────┐        ┌──────────────────────────────┐
│    Frontend (Nginx/Node)     │        │  Backend (Spring Boot)       │
│    (Multiple Replicas)       │        │  (Multiple Replicas)         │
│                              │        │                              │
│  - Cache Layer              │        │  - API Layer                │
│  - CDN Integration          │        │  - WebSocket Support        │
└──────────────────────────────┘        └──────────────────────────────┘
        ↓                                           ↓
┌────────────────────────────────────────────────────────────────┐
│                 RDS / Cloud Database (PostgreSQL)             │
│          - Multi-AZ Replication                               │
│          - Automated Backups                                  │
│          - Point-in-time Recovery                            │
└────────────────────────────────────────────────────────────────┘
```

## Deployment Steps

### 1. Prepare Infrastructure

#### AWS Example:

```bash
# Create VPC
aws ec2 create-vpc --cidr-block 10.0.0.0/16

# Create RDS Database
aws rds create-db-instance \
  --db-instance-identifier suits-in-db \
  --db-instance-class db.t3.small \
  --engine postgres \
  --master-username postgres \
  --allocated-storage 20

# Create ECS Cluster
aws ecs create-cluster --cluster-name suits-in-prod
```

### 2. Build Docker Images

```bash
# Build backend
docker build -t suits-in-api:1.0.0 ./backend
docker tag suits-in-api:1.0.0 <AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/suits-in-api:1.0.0

# Build frontend
docker build -t suits-in-ui:1.0.0 ./frontend
docker tag suits-in-ui:1.0.0 <AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/suits-in-ui:1.0.0

# Push to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com

docker push <AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/suits-in-api:1.0.0
docker push <AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/suits-in-ui:1.0.0
```

### 3. Deploy Containers

#### Using Docker Compose (VPS):

```bash
# SSH to server
ssh ubuntu@your-server-ip

# Clone repository
git clone https://github.com/yourusername/suits-in.git
cd suits-in

# Create production environment file
cat > .env.prod <<EOF
DB_URL=postgresql://prod-db-host:5432/suits_in
DB_USER=postgres
DB_PASSWORD=$(openssl rand -base64 32)
JWT_SECRET=$(openssl rand -base64 32)
OPENAI_API_KEY=sk-...
EOF

# Start services
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

#### Using Kubernetes (EKS/AKS):

```bash
# Create namespace
kubectl create namespace suits-in-prod

# Apply secrets
kubectl create secret generic suits-in-secrets \
  --from-literal=DB_PASSWORD=<password> \
  --from-literal=JWT_SECRET=<secret> \
  -n suits-in-prod

# Deploy backend
kubectl apply -f k8s/backend-deployment.yml -n suits-in-prod

# Deploy frontend
kubectl apply -f k8s/frontend-deployment.yml -n suits-in-prod

# Expose services
kubectl apply -f k8s/services.yml -n suits-in-prod
```

### 4. Configure SSL/TLS

```bash
# Using Let's Encrypt (Certbot)
sudo certbot certonly --standalone -d suits-in.com

# Update Nginx config
sudo nano /etc/nginx/sites-available/suits-in

# Enable SSL
ssl_certificate /etc/letsencrypt/live/suits-in.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/suits-in.com/privkey.pem;

# Restart Nginx
sudo systemctl restart nginx
```

### 5. Setup Database Backups

```bash
# AWS RDS Automated Backups
aws rds create-db-instance \
  --backup-retention-period 30 \
  --copy-tags-to-snapshot

# Manual backup
aws rds create-db-snapshot \
  --db-instance-identifier suits-in-db \
  --db-snapshot-identifier suits-in-db-backup-$(date +%Y%m%d)
```

### 6. Configure Monitoring & Logging

#### CloudWatch (AWS):

```bash
# Create log groups
aws logs create-log-group --log-group-name /suits-in/backend
aws logs create-log-group --log-group-name /suits-in/frontend

# Create alarms
aws cloudwatch put-metric-alarm \
  --alarm-name suits-in-api-errors \
  --alarm-description "Alert on API errors" \
  --metric-name Errors \
  --threshold 100
```

#### ELK Stack (Self-hosted):

```yaml
version: '3.8'
services:
  elasticsearch:
    image: elasticsearch:8.0.0
    environment:
      - xpack.security.enabled=false
    ports:
      - "9200:9200"

  logstash:
    image: logstash:8.0.0
    volumes:
      - ./logstash.conf:/usr/share/logstash/pipeline/logstash.conf

  kibana:
    image: kibana:8.0.0
    ports:
      - "5601:5601"
```

### 7. Performance Optimization

#### Redis Caching:

```yaml
# docker-compose.prod.yml
  redis:
    image: redis:7-alpine
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"
```

#### CDN Configuration:

```nginx
# Nginx - Cache static assets
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
  expires 365d;
  add_header Cache-Control "public, immutable";
  add_header X-Content-Type-Options "nosniff";
}
```

### 8. Security Hardening

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Configure firewall
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable

# Set up SSH keys (disable password login)
ssh-copy-id -i ~/.ssh/id_rsa.pub ubuntu@your-server-ip

# Configure Fail2Ban
sudo apt install fail2ban
sudo systemctl enable fail2ban
```

## Environment Variables

### Backend Production:

```env
SPRING_PROFILES_ACTIVE=prod
SPRING_DATASOURCE_URL=postgresql://prod-db.rds.amazonaws.com:5432/suits_in
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=${DB_PASSWORD}
SPRING_JPA_HIBERNATE_DDL_AUTO=validate

JWT_SECRET=${JWT_SECRET}
JWT_EXPIRATION=3600000

OPENAI_API_KEY=${OPENAI_API_KEY}

LOGGING_LEVEL_ROOT=WARN
LOGGING_LEVEL_COM_SUITS=INFO
```

### Frontend Production:

```env
NEXT_PUBLIC_API_URL=https://api.suits-in.com
NEXT_PUBLIC_WS_URL=wss://api.suits-in.com
NEXT_PUBLIC_APP_ENV=production
NODE_ENV=production
```

## Maintenance

### Database Maintenance:

```bash
# Vacuum database
psql -U postgres -d suits_in -c "VACUUM ANALYZE;"

# Check indexes
psql -U postgres -d suits_in -c "\di"

# Monitor connections
psql -U postgres -d suits_in -c "SELECT usename, count(*) FROM pg_stat_activity GROUP BY usename;"
```

### Log Rotation:

```bash
# Create logrotate config
cat > /etc/logrotate.d/suits-in <<EOF
/var/log/suits-in/*.log {
    daily
    rotate 30
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
    sharedscripts
    postrotate
        systemctl reload docker
    endscript
}
EOF
```

## Scaling

### Horizontal Scaling:

```bash
# Add more backend replicas
kubectl scale deployment suits-in-api --replicas=3

# Add more frontend replicas
kubectl scale deployment suits-in-ui --replicas=3
```

### Database Scaling:

```bash
# Upgrade RDS instance
aws rds modify-db-instance \
  --db-instance-identifier suits-in-db \
  --db-instance-class db.r5.xlarge \
  --apply-immediately

# Add read replicas
aws rds create-db-instance-read-replica \
  --db-instance-identifier suits-in-db-replica-1 \
  --source-db-instance-identifier suits-in-db
```

## Disaster Recovery

### Backup Strategy:

1. **Daily automated backups** (retain 30 days)
2. **Weekly snapshots** (retain 12 weeks)
3. **Monthly archives** (retain 3 years)

### Recovery Procedure:

```bash
# Restore from snapshot
aws rds restore-db-instance-from-db-snapshot \
  --db-instance-identifier suits-in-db-restored \
  --db-snapshot-identifier suits-in-db-backup-20240101

# Update application to use new database
# Verify data integrity
# Cutover to restored database
```

## Monitoring Checklist

- [ ] CPU utilization < 80%
- [ ] Memory utilization < 80%
- [ ] Disk space > 20% free
- [ ] API response time < 500ms (p95)
- [ ] Error rate < 0.1%
- [ ] Database connections stable
- [ ] SSL certificate validity (>30 days)
- [ ] Backup completion verified
- [ ] All logs being aggregated
- [ ] Alerts configured and tested

## Support & Troubleshooting

For deployment issues:
1. Check application logs: `kubectl logs deployment/suits-in-api`
2. Check system logs: `journalctl -xe`
3. Monitor resource usage: `top`, `df`, `free`
4. Verify database connection: `psql -U postgres -h db-host`
5. Test API endpoints: `curl -H "Authorization: Bearer $TOKEN" https://api.suits-in.com/clients`

---

**Last Updated**: 12 May 2026
**Version**: 1.0

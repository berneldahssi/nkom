# NKOM Security Checklist

## Pre-Deployment Security Review

### Infrastructure Security

#### Network Security
- [ ] VPC created with private subnets for databases
- [ ] NAT Gateway configured for outbound traffic
- [ ] Security groups configured with least privilege (ingress restricted)
- [ ] VPC Flow Logs enabled and configured
- [ ] No security group rules allow 0.0.0.0/0 to databases
- [ ] Bastion/Jump host configured for admin access (if needed)

#### Database Security
- [ ] RDS encryption enabled (KMS keys with rotation)
- [ ] RDS backup encryption enabled
- [ ] RDS not publicly accessible (`publicly_accessible = false`)
- [ ] IAM database authentication enabled
- [ ] Database subnet group only in private subnets
- [ ] Enhanced monitoring enabled (1-minute intervals for production)
- [ ] CloudWatch Logs exports enabled for PostgreSQL
- [ ] Backup retention period set (minimum 7 days)
- [ ] Multi-AZ failover enabled for production
- [ ] Deletion protection enabled for production databases

#### Cache Security
- [ ] Redis encryption at rest enabled (AES-256)
- [ ] Redis encryption in transit enabled (TLS)
- [ ] Redis AUTH token configured (16+ random characters)
- [ ] Redis subnet group only in private subnets
- [ ] Redis not publicly accessible
- [ ] Redis security group restricted to app servers only

#### Storage Security
- [ ] S3 bucket for uploads not publicly accessible
- [ ] S3 block all public access enabled
- [ ] S3 versioning enabled
- [ ] S3 server-side encryption enabled (KMS keys)
- [ ] S3 bucket policy enforces SSL/TLS
- [ ] S3 access logging enabled to separate bucket
- [ ] S3 lifecycle policies configured (object expiration)
- [ ] S3 logging bucket encrypted and locked down
- [ ] KMS keys configured with automatic rotation
- [ ] KMS key policies restrict access appropriately

### Application Security

#### Authentication & Authorization
- [ ] SECRET_KEY is 32+ random characters (not default)
- [ ] JWT algorithm set to HS256 (or RS256 for keys)
- [ ] Access token expiration set to 30 minutes or less
- [ ] Refresh token expiration set appropriately
- [ ] Password hashing using bcrypt with proper cost factor
- [ ] Password strength validation enforced (12+ chars, mixed case, numbers, special chars)
- [ ] Rate limiting enabled on auth endpoints
- [ ] Account lockout after failed login attempts
- [ ] Multi-factor authentication (MFA) available (optional for MVP)

#### Data Protection
- [ ] All sensitive data fields encrypted at rest
- [ ] Database connections use SSL/TLS
- [ ] Redis connections use TLS with AUTH
- [ ] Sensitive data never logged
- [ ] Secrets not stored in code (use environment variables)
- [ ] .env file excluded from git
- [ ] Database credentials rotated from default values
- [ ] API keys rotated periodically

#### API Security
- [ ] CORS configured with specific origins (not `*`)
- [ ] CSRF protection enabled (or API is stateless with tokens)
- [ ] Security headers implemented:
  - [ ] X-Content-Type-Options: nosniff
  - [ ] X-Frame-Options: DENY
  - [ ] X-XSS-Protection: 1; mode=block
  - [ ] Content-Security-Policy configured
  - [ ] Strict-Transport-Security (HSTS) enabled
  - [ ] Referrer-Policy: strict-origin-when-cross-origin
- [ ] Input validation enforced on all endpoints
- [ ] SQL injection prevention (parameterized queries)
- [ ] NoSQL injection prevention (if applicable)
- [ ] Path traversal prevention
- [ ] Rate limiting configured per endpoint
- [ ] Request size limits enforced
- [ ] File upload validation (type, size, content)
- [ ] Error messages don't leak sensitive information

#### Dependency Security
- [ ] Dependencies pinned to specific versions
- [ ] No known CVEs in dependencies (`pip check`, `npm audit`)
- [ ] Development dependencies separated from production
- [ ] Docker base images from official sources
- [ ] Docker images scanned for vulnerabilities
- [ ] Requirements files reviewed for security

### Monitoring & Logging

#### CloudWatch Monitoring
- [ ] RDS CPU utilization alarm (> 80%)
- [ ] RDS storage utilization alarm (> 80%)
- [ ] RDS network throughput alarm
- [ ] RDS read/write latency monitoring
- [ ] Redis CPU utilization alarm
- [ ] Redis eviction rate monitoring
- [ ] Redis connection count monitoring
- [ ] Application error rate monitoring
- [ ] API response time monitoring
- [ ] Log group retention policy set (7+ days)
- [ ] Log filters configured for security events

#### Logging Configuration
- [ ] All authentication attempts logged
- [ ] All failed authorization attempts logged
- [ ] All admin actions logged
- [ ] All database queries logged (in development)
- [ ] Logs do not contain passwords or tokens
- [ ] Logs shipped to CloudWatch Logs
- [ ] Log retention configured appropriately
- [ ] CloudWatch Insights queries set up for common security events

#### Alerting
- [ ] SNS topics created for critical alerts
- [ ] Email notifications configured
- [ ] Slack/PagerDuty integration configured (optional)
- [ ] Alert thresholds reviewed and tuned
- [ ] On-call rotation established

### Compliance & Best Practices

#### Documentation
- [ ] Security policy documented
- [ ] Data retention policy documented
- [ ] Incident response plan documented
- [ ] Disaster recovery plan documented
- [ ] Access control matrix documented
- [ ] API documentation includes security requirements

#### Testing
- [ ] Security unit tests written
- [ ] OWASP Top 10 tested against
- [ ] Penetration testing scheduled (before production)
- [ ] Dependency scanning in CI/CD
- [ ] SAST scanning configured (static analysis)
- [ ] DAST scanning configured (dynamic analysis)

#### Code Review
- [ ] Security review checklist in PR template
- [ ] At least 2 reviews required for production changes
- [ ] Code reviewer trained in security
- [ ] Security linting enabled (bandit, semgrep)

#### Infrastructure as Code
- [ ] Terraform backend encrypted
- [ ] Terraform state file access restricted
- [ ] Terraform variables marked sensitive
- [ ] No hardcoded credentials in IaC
- [ ] IAM policies follow least privilege principle
- [ ] Service roles have minimal permissions

### Environment-Specific Checks

#### Development Environment
- [ ] DEBUG=false (even in dev, use logging instead)
- [ ] Separate database from production
- [ ] Limited data retention (or clear daily)
- [ ] Credentials auto-generated, not shared
- [ ] VPC isolation not required but recommended

#### Staging Environment
- [ ] Mirrors production configuration
- [ ] Separate database from production
- [ ] Backup and restore tested
- [ ] Disaster recovery plan tested
- [ ] Security scanning enabled
- [ ] Performance testing includes security aspects

#### Production Environment
- [ ] DEBUG=false
- [ ] ENVIRONMENT=production
- [ ] Multi-AZ enabled
- [ ] Deletion protection enabled
- [ ] Backups tested and verified
- [ ] HSTS header with long TTL
- [ ] Certificates valid and not self-signed
- [ ] SSL/TLS version 1.2 or higher only
- [ ] Weak ciphers disabled
- [ ] DDoS protection enabled (AWS Shield)
- [ ] WAF rules configured (if applicable)

### Access Control

#### IAM Roles & Policies
- [ ] IAM roles follow least privilege principle
- [ ] Application IAM role has minimal S3 permissions
- [ ] Application IAM role cannot modify infrastructure
- [ ] Admin IAM role has MFA required
- [ ] Service roles audited for excessive permissions
- [ ] Cross-account access configured (if needed)

#### Secrets Management
- [ ] Secrets stored in AWS Secrets Manager (or Parameter Store)
- [ ] Application retrieves secrets at runtime, not build time
- [ ] Secrets rotated automatically
- [ ] Secrets not committed to git (even encrypted)
- [ ] .env.example has placeholder values only
- [ ] Secrets Manager KMS key restricted

#### User Access
- [ ] Admin access requires MFA
- [ ] Database access restricted to app servers
- [ ] Redis access restricted to app servers
- [ ] S3 access restricted to app role
- [ ] CloudWatch Logs access restricted
- [ ] No hardcoded database usernames in code

### Incident Response

#### Preparedness
- [ ] Incident response plan documented
- [ ] Escalation contacts defined
- [ ] On-call rotation established
- [ ] Security contact information current
- [ ] Communication plan for security incidents
- [ ] Customer notification template prepared

#### Monitoring
- [ ] Security event detection rules in place
- [ ] False positive rate monitored
- [ ] Alert fatigue addressed
- [ ] Metrics dashboards created

#### Post-Incident
- [ ] Root cause analysis template created
- [ ] Lessons learned process established
- [ ] Security improvements tracked
- [ ] Affected customers notified appropriately

### Compliance

#### GDPR (if serving EU users)
- [ ] Data processing agreement in place
- [ ] Personal data encryption enforced
- [ ] Data retention policy configured
- [ ] User data deletion capability implemented
- [ ] Data export capability implemented
- [ ] Privacy policy available

#### HIPAA (if handling health data)
- [ ] Encryption at rest and in transit enforced
- [ ] Access controls implemented
- [ ] Audit logging enabled
- [ ] Business Associate Agreement in place
- [ ] Breach notification plan in place

#### CCPA (if serving California users)
- [ ] Consumer privacy rights implemented
- [ ] Data sale opt-out mechanism available
- [ ] Privacy policy compliance
- [ ] Vendor/processor agreements in place

#### PCI-DSS (if handling payment data)
- [ ] Payment processing through PCI-compliant provider
- [ ] No cardholder data storage in database
- [ ] No cardholder data in logs or backups
- [ ] Encryption of authentication data
- [ ] Access controls to cardholder data

### Regular Maintenance

#### Updates & Patches
- [ ] OS patches applied regularly
- [ ] Database patches applied regularly
- [ ] Application dependencies updated
- [ ] Vulnerability scans scheduled weekly
- [ ] Security advisories monitored
- [ ] Update testing process established

#### Backups & Recovery
- [ ] Backup schedule verified (daily minimum)
- [ ] Backup restoration tested monthly
- [ ] Backup encryption verified
- [ ] Backup storage isolated from primary
- [ ] RTO (Recovery Time Objective) < 4 hours
- [ ] RPO (Recovery Point Objective) < 1 hour

#### Security Audits
- [ ] Monthly security checklist review
- [ ] Quarterly security testing
- [ ] Annual penetration testing
- [ ] Annual architecture review
- [ ] Compliance audit scheduled

---

## Pre-Launch Sign-Off

- [ ] Security checklist 100% complete
- [ ] All critical findings remediated
- [ ] All high findings risk-accepted
- [ ] Penetration test completed
- [ ] Incident response plan reviewed
- [ ] Security team sign-off obtained
- [ ] Legal/Compliance sign-off obtained

**Sign-Off Date**: _______________

**Security Lead**: _______________

**Infrastructure Lead**: _______________

**Product Lead**: _______________

---

## Post-Launch Monitoring

### Week 1
- [ ] Monitor error rates and exceptions
- [ ] Monitor authentication failures
- [ ] Monitor database performance
- [ ] Monitor API response times
- [ ] Monitor infrastructure costs
- [ ] Verify backup completion
- [ ] Check CloudWatch logs for anomalies

### Monthly
- [ ] Review access logs
- [ ] Review security events
- [ ] Review failed login attempts
- [ ] Update threat model
- [ ] Review third-party access
- [ ] Test disaster recovery

### Quarterly
- [ ] Dependency security audit
- [ ] Infrastructure review
- [ ] Security control testing
- [ ] Penetration testing
- [ ] Policy review and updates

### Annually
- [ ] Full security assessment
- [ ] Compliance audit
- [ ] Third-party security review
- [ ] Incident response drill
- [ ] Business continuity plan test

---

**Document Version**: 1.0
**Last Updated**: February 2026
**Next Review**: June 2026

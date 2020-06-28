# website-cf-template

This is a CloudFormation template that allows you to quickly create a stack in AWS with the basic resources for a
S3-backed website. Use the stack definition with your preferred CF tool to create the stack.

# Resulting infrastructure
Creating a stack with this templates yields the following infrastructure.

- A S3 bucket that contains the content of your website.
  You can point your resulting CI to publish the site to this bucket.
- A CloudFront distribution backed by the above S3 bucket.
- A Route53 zone for the site pointing to the CloudFront distribution.
- An IAM user with `PutObject` access to the S3 bucket.
  This is a user intended to power any CI.
  - Note: you will have to create the stack with the `CAPABILITY_IAM` capability.

More detail about the resources can be found in the resulting stack's Outputs.

# Parameters
The stack takes in three parameters

- `DomainName`: the second-level domain. Examples: `example`, `google`, `wikipedia`.
- `TopLevelDomain`: the top-level domain; defaults to `com`. Examples: `org`, `net`, `io` ;
- `ACMCertId`: the ID that references your HTTPS certificate in AWS Certificate Manager. This parameter is optional.

To use the stack to create a website for `example.com`, `example` would be the `DomainName` and `com` would be the
` TopLevelDomain`.

## HTTPS
In order to make a HTTPS site (which is highly recommended), you must purchase a certificate through your preferred
certificate authority (CA) and upload into AWS Certificate Manager (ACM).
This is intended to be a manual step you go through via your CA's process.

The `ACMCertId` is optional so you can create the stack and set up your CI while waiting to complete your CA's process.
It is highly recommended that you update the stack with the appropriate cert id once your CA process is completed.

# Implementation details

- `www.example.com` will redirect to `example.com` via a CNAME record.
- 404 and 403 errors are mapped to a 200 for the `index.html` page of your website.
  This is to integrate with Angular routing. (TODO: make this optional.)
- The name servers for your zone will be published via an Output.
  If you've purchased your domain outside of AWS, update the domain's name servers in order to allow Route53 to take
  control.
- If https is enabled, the `redirect-to-https` protocol will be enabled on the distribution.
- If you use this to make two different stacks with the same `DomainName` but different `TopLevelDomain`s, you will have
  clashes with your bucket names. (TODO: fix this.)

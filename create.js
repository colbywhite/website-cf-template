// This is an example script leveraging aws-cf-monitor to show how to create a stacke from the template// This is an example script leveraging aws-cf-monitor to show how to create a stack from the template.
const {LOG_NAME, Monitor} = require('aws-cf-monitor');
const AWS = require('aws-sdk');
const fs = require('fs');
const winston = require('winston');

const template = fs.readFileSync('./stack.yaml', 'utf8');

if (!template) {
    throw new Error('template is undefined')
}

winston.loggers.add(LOG_NAME, {
    format: winston.format.simple(),
    transports: [new winston.transports.Console()]
});

const cf = new AWS.CloudFormation();
const domain = 'example';
const tld = 'org';
const input = {
    StackName: domain,
    Parameters: [
        {ParameterKey: 'DomainName', ParameterValue: domain},
        {ParameterKey: 'TopLevelDomain', ParameterValue: tld}
    ],
    Capabilities: ['CAPABILITY_IAM'],
    TemplateBody: template
};

cf.createStack(input)
    .promise()
    .then(() => new Monitor().monitor(domain, cf))
    .catch(console.error);

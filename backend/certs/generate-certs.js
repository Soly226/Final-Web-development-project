const selfsigned = require('selfsigned');
const fs = require('fs');
const path = require('path');

const attrs = [{ name: 'commonName', value: 'localhost' }];
const opts = {
  keySize: 2048,
  days: 365,
  algorithm: 'sha256',
  extensions: [
    {
      name: 'basicConstraints',
      cA: true,
    },
    {
      name: 'keyUsage',
      keyCertSign: true,
      digitalSignature: true,
      nonRepudiation: true,
      keyEncipherment: true,
      dataEncipherment: true,
    },
    {
      name: 'subjectAltName',
      altNames: [
        {
          type: 2, // DNS
          value: 'localhost',
        },
        {
          type: 7, // IP
          ip: '127.0.0.1',
        },
      ],
    },
  ],
};

async function generateCertificates(certsDir) {
  const pems = await selfsigned.generate(attrs, opts);
  fs.writeFileSync(path.join(certsDir, 'key.pem'), pems.private);
  fs.writeFileSync(path.join(certsDir, 'cert.pem'), pems.cert);
}

module.exports = generateCertificates;

// Execute directly if run via CLI
if (require.main === module) {
  console.log('Generating self-signed SSL certificates for localhost...');
  generateCertificates(__dirname)
    .then(() => console.log('SSL Certificates generated successfully inside backend/certs/'))
    .catch((err) => {
      console.error('Failed to generate SSL certificates:', err);
      process.exit(1);
    });
}


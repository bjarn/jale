"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const opensslConfig = (hostname) => `[req]
distinguished_name = req_distinguished_name
req_extensions = v3_req

[req_distinguished_name]
countryName = Country Name (2 letter code)
countryName_default = NL
stateOrProvinceName = State or Province Name (full name)
stateOrProvinceName_default = ZH
localityName = Locality Name (eg, city)
localityName_default = Rotterdam
organizationalUnitName\t= Organizational Unit Name (eg, section)
organizationalUnitName_default\t= Domain Control Validated
commonName = Just Another Local Environment
commonName_max\t= 64

[ v3_req ]
# Extensions to add to a certificate request
basicConstraints = CA:FALSE
keyUsage = nonRepudiation, digitalSignature, keyEncipherment
subjectAltName = @alt_names

[alt_names]
DNS.1 = ${hostname}
DNS.2 = *.${hostname}
`;
exports.default = opensslConfig;
//# sourceMappingURL=openssl.js.map
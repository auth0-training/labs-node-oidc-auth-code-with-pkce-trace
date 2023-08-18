const {
  ISSUER_BASE_URL,
  AUDIENCE,
  VERCEL_URL,
  VERCEL_GIT_COMMIT_REF,
  VERCEL_GITHUB_REPO,
  VERCEL_GITHUB_ORG,
  PORT = 35500,
} = process.env;

const appUrl = VERCEL_URL
  ? `https://${VERCEL_GITHUB_REPO}-git-${VERCEL_GIT_COMMIT_REF}-${VERCEL_GITHUB_ORG.toLowerCase()}.vercel.app`
  : `http://localhost:${PORT}`;

function checkEnvironment(){
  // Use the Codespace App URL if we're in the Codespace environment
  if(process.env.CODESPACE_NAME){
    return `https://${process.env.CODESPACE_NAME}-${PORT}.${process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}`
  }
  // otherwise use the localhost App URL
  return appUrl;
}

function checkUrl() {
  return (req, res, next) => {
    const host = req.headers.host;
    if (!appUrl.includes(host)) {
      return res.status(301).redirect(appUrl);
    }
    return next();
  };
}

function removeTrailingSlashFromUrl(url) {
  if (!url.endsWith('/')) return url;

  return url.substring(0, url.length - 1);
}

console.log('\n----------------------------------');
console.log('Envronment Settings:');
console.log(`APP_URL: ${appUrl}`);
console.log(`ISSUER_BASE_URL: ${ISSUER_BASE_URL}`);
console.log(`AUDIENCE: ${AUDIENCE}`);
console.log('----------------------------------\n');

module.exports = {
  checkUrl,
  APP_URL: checkEnvironment(),
  ISSUER_BASE_URL: removeTrailingSlashFromUrl(ISSUER_BASE_URL),
  AUDIENCE: AUDIENCE,
  PORT: PORT,
};

module.exports = {
  swcMinify: true,
 
  experimental: {
    modularizeImports: {
      // "@mui/material": {
      //   transform: "@mui/material/{{member}}",
      // },
      "@mui/icons-material": {
        transform: "@mui/icons-material/{{member}}",
      },
      "@mui/styles": {
        transform: "@mui/styles/{{member}}",
      },
      "@mui/lab": {
        transform: "@mui/lab/{{member}}",
      },
    },
  },
};
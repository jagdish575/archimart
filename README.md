# ArchiMart — Multi-Vendor Marketplace

## Deploy karne ke 3 tarike:

### Option 1: Vercel (Sabse aasaan — FREE)
1. vercel.com pe account banao
2. GitHub pe yeh folder upload karo
3. Vercel pe "Import Project" karo
4. Apna domain add karo Settings → Domains mein

### Option 2: Netlify (FREE)
1. netlify.com pe account banao
2. `npm run build` run karo
3. `build/` folder ko Netlify pe drag & drop karo
4. Custom domain add karo

### Option 3: cPanel / Hostinger / GoDaddy Hosting
1. `npm run build` run karo (build/ folder banega)
2. build/ folder ke andar ka content (index.html + static/) 
   apne cPanel File Manager mein public_html/ mein upload karo
3. Done!

## Local test karne ke liye:
```
npm install
npm start
```
Browser mein http://localhost:3000 khulega

## Build (production):
```
npm run build
```

FSRLink
=======

FSRLink is a lightweight system that allows users to submit form data, store it in Google Sheets, and generate a PDF receipt using that data.

This project is built using Next.js, Google Sheets API, and pdf-lib.

Live Demo
---------

Website: [https://fsr-link.vercel.app/](https://fsr-link.vercel.app/)
YouTube Demo: [https://youtu.be/3THGfAawo7Y](https://youtu.be/3THGfAawo7Y)

Features
--------

*   Submit form data to Google Sheets
    
*   Secure Google Service Account authentication
    
*   Retrieve and display stored submissions
    
*   Generate a PDF receipt for each entry
    
*   Simple UI and easy deployment
    

Tech Stack
----------

*   Next.js (App Router)
    
*   TypeScript
    
*   Google Sheets API
    
*   pdf-lib
    
*   Vercel
    

Project Structure
-----------------

src/  
 app/    
  api/      
   orders/        
    route.ts – POST (add order), GET (fetch all orders)      
   orders/
    \[id\]/        
      route.ts – Fetch order by ID and generate PDF    
 orders/      
  page.tsx – UI for listing orders  
lib/    
 google.ts – Google Sheets client setup

Environment Variables
---------------------

Create a .env file with:

GOOGLE\_SHEET\_ID=
GOOGLE\_CLIENT\_EMAIL=
GOOGLE\_PRIVATE\_KEY=

Installation
------------

git clone https://github.com/arunkrish11/FSRLink
cd fsrlink
npm install

Running Locally
---------------

npm run dev

Then open:

[http://localhost:3000](http://localhost:3000)

Deployment
----------

vercelvercel --prod

License
-------

This project is for learning and demonstration purposes.

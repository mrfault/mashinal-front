<template>
   <table class="invoiceTable">
      <tbody>
         <tr class="invoiceTable__head">
            <td class="invoiceTable__head-item">
               <img class="invoiceTable__logo" src="https://dev.mashin.al/icons/alv-logo.svg" alt="logo">
            </td>

            <td class="invoiceTable__head-item">
               <table>
                  <tbody>
                     <tr>
                        <td class="invoiceTable__head-left">
                           <p>*8787</p>
                           <p>park Azure,Blok 6 Mertebe 3</p>
                           <p>www.al.ventures</p>
                        </td>

                        <td>
                           <img class="invoiceTable__barcode" src="https://dev.mashin.al/images/invoice_barcode.jpg" alt="barcode">
                        </td>
                     </tr>
                  </tbody>
               </table>
            </td>
         </tr>

         <tr class="invoiceTable__company">
            <td class="invoiceTable__company-left">
               <p>ALVENTURES" MMC</p>
               <p>
                  <span>VÖEN:</span>
                  2006113431
               </p>
            </td>

            <td class="invoiceTable__company-right">
               <p>KapitalBank</p>
               <p>VÖEN: 2006113431</p>
               <p>Hesab №: AZ97AIIB40060019440819871103</p>
               <p>Müxbir hesab №: AZ37NABZ01350100000000001944</p>
               <p>Valyuta: AZN Kod: 200037 SWIFT: AIIBAZ2XXXX</p>
            </td>
         </tr>

         <tr class="invoiceTable__details">
            <td colspan="2">
               <h5>Hesab - faktura №7383</h5>

               <span>Tarix:</span>
               <p>14.04.2023-cü il</p>

               <span>Xidmətin təsviri:</span>
               <p>Reklam paketinin (Mashin.al - Standart paketi) təqdim olunması üçün avans ödənişi</p>

               <span>Xidmətin müddəti:</span>
               <p>14.04.2023 - 14.05.2023</p>

               <span>Elan sayı:</span>
               <p>50</p>

               <span>Ödənişli xidmətlər:</span>
               <p>150.00 AZN</p>

               <br>
            </td>
         </tr>

         <tr class="invoiceTable__price">
            <td>
               <p> <span>Məbləğ:</span> <span>246.00 AZN</span> </p>
               <p> <span>ƏDV:</span> <span>246.00 AZN</span> </p>
               <p> <span>Ümumi məbləğ:</span> <span>246.00 AZN</span> </p>
            </td>
         </tr>
      </tbody>

      <tfoot>
         <tr class="invoiceTable__footer">
            <td colspan="2">
               <span>"ALVENTURES" MMC-nin İcraçı Direktoru:</span>
               <p>Elçin Məmmədov</p>
            </td>
         </tr>
      </tfoot>
   </table>
</template>

<style>
   @font-face {
      font-family: 'Gilroy';
      src: url('https://dev.mashin.al/fonts/gilroy/Gilroy-Regular.woff2') format('woff2'),
           url('https://dev.mashin.al/fonts/gilroy/Gilroy-Regular.woff') format('woff');
      font-weight: normal;
      font-style: normal;
      font-display: swap;
   }

   @font-face {
      font-family: 'Gilroy';
      src: url('https://dev.mashin.al/fonts/gilroy/Gilroy-Medium.woff2') format('woff2'),
      url('https://dev.mashin.al/fonts/gilroy/Gilroy-Medium.woff') format('woff');
      font-weight: 500;
      font-style: normal;
      font-display: swap;
   }

   @font-face {
      font-family: 'Gilroy';
      src: url('https://dev.mashin.al/fonts/gilroy/Gilroy-Semibold.woff2') format('woff2'),
      url('https://dev.mashin.al/fonts/gilroy/Gilroy-Semibold.woff') format('woff');
      font-weight: 600;
      font-style: normal;
      font-display: swap;
   }

   @font-face {
      font-family: 'Gilroy';
      src: url('https://dev.mashin.al/fonts/gilroy/Gilroy-Bold.woff2') format('woff2'),
      url('https://dev.mashin.al/fonts/gilroy/Gilroy-Bold.woff') format('woff');
      font-weight: bold;
      font-style: normal;
      font-display: swap;
   }

   * {
      font-family: 'Gilroy', sans-serif;
   }

   .invoiceTable {
      margin-top: 100px;
      width: 600px;
      background: url("https://dev.mashin.al/images/invoice_price_bg.jpg") center center / cover no-repeat;
   }

   .invoiceTable tbody tr td,
   .invoiceTable tfoot tr td {
      padding: 20px;
   }

   .invoiceTable p {
      margin: 0;
   }

   .invoiceTable .invoiceTable__logo {
      width: 105px;
   }

   .invoiceTable .invoiceTable__barcode {
      width: 55px;
   }

   .invoiceTable .invoiceTable__head .invoiceTable__head-item {
      border-bottom: 2px solid #EE2539;
   }

   .invoiceTable .invoiceTable__head .invoiceTable__head-left {
      text-align: right;
      border-right: 1px solid #0A1B3D;
   }
   .invoiceTable .invoiceTable__head .invoiceTable__head-left p {
      white-space: nowrap;
   }
   .invoiceTable .invoiceTable__head .invoiceTable__head-left p:first-child {
      font-weight: 700;
      font-size: 16px;
      line-height: 20px;
      color: #F81734;
   }
   .invoiceTable .invoiceTable__head .invoiceTable__head-left p:nth-child(2) {
      font-weight: 500;
      font-size: 10px;
      line-height: 12px;
      color: #081A3E;
      margin: 6px 0;
   }
   .invoiceTable .invoiceTable__head .invoiceTable__head-left p:last-child {
      font-weight: 700;
      font-size: 10px;
      line-height: 12px;
      color: #081A3E;
   }

   .invoiceTable .invoiceTable__company .invoiceTable__company-left p:first-child {
      margin-top: -46px;
      font-weight: 600;
      font-size: 14px;
      line-height: 17px;
      color: #0A1A3D;
   }
   .invoiceTable .invoiceTable__company .invoiceTable__company-left p:last-child {
      margin-top: 8px;
      font-weight: 400;
      line-height: 14px;
      color: #0A1A3D;
   }
   .invoiceTable .invoiceTable__company .invoiceTable__company-left p:last-child span {
      font-weight: 500;
      font-size: 12px;
      line-height: 15px;
      color: #9C9C9C;
   }

   .invoiceTable .invoiceTable__company .invoiceTable__company-right {
      text-align: right;
   }
   .invoiceTable .invoiceTable__company .invoiceTable__company-right p {
      font-weight: 400;
      font-size: 10px;
      line-height: 12px;
      color: #0A1A3D;
   }
   .invoiceTable .invoiceTable__company .invoiceTable__company-right p:not(:first-child) {
      margin-top: 8px;
   }

   .invoiceTable .invoiceTable__details h5 {
      font-weight: 600;
      font-size: 14px;
      line-height: 17px;
      color: #0A1A3D;
      margin: 0;
   }
   .invoiceTable .invoiceTable__details span {
      display: inline-block;
      font-weight: 500;
      font-size: 12px;
      line-height: 15px;
      color: #9C9C9C;
      margin: 20px 0 8px 0;
   }
   .invoiceTable .invoiceTable__details p {
      font-weight: 400;
      font-size: 12px;
      line-height: 14px;
      color: #0A1A3D;
   }

   .invoiceTable .invoiceTable__price td {
      background: url("https://dev.mashin.al/images/invoice_barcode.png") center center / cover no-repeat;
      padding: 25px;
   }
   .invoiceTable .invoiceTable__price p {
      font-weight: 500;
      font-size: 14px;
      line-height: 17px;
      color: #FFFFFF;
   }
   .invoiceTable .invoiceTable__price p span:first-child {
      display: inline-block;
      width: 115px;
   }
   .invoiceTable .invoiceTable__price p:not(:first-child) {
      margin-top: 15px;
   }
   .invoiceTable .invoiceTable__price p:last-child span:last-child {
      font-weight: 700;
      font-size: 16px;
      line-height: 20px;
   }

   .invoiceTable .invoiceTable__footer span {
      display: inline-block;
      border-top: 1px solid #FFE9EC;
      padding-top: 8px;
      margin-top: 70px;
      font-weight: 500;
      font-size: 10px;
      line-height: 12px;
      color: #9C9C9C;
   }
   .invoiceTable .invoiceTable__footer p {
      margin-top: 8px;
      font-weight: 600;
      font-size: 12px;
      line-height: 15px;
      color: #0A1A3D;
   }
</style>

<template>
   <table class="invoice">
      <tbody>
         <tr class="headLine">
            <td class="headLine__logo text-left">
               <img src="/icons/alv-logo.svg" alt="logo.svg">
            </td>

            <td class="headLine__info text-right">
               <div>
                  <p class="headLine__call">*8787</p>
                  <p class="headLine__address">park Azure,Blok 6 Mertebe 3</p>
                  <a class="headLine__link" href="#">www.al.ventures</a>
               </div>

               <div class="headLine__borderLong"></div>
               <!--            <img class="headLine__image" src="../assets/invoice/QR.svg" alt="QR.svg">-->
            </td>
         </tr>

         <br>
         <br>

         <tr class="voin">
            <td class="voinLeftSide text-left">
               <strong>"ALVENTURES" MMC</strong>
               <p><span>VÖEN:</span> 2006113431</p>
            </td>

            <td class="voinRightSide text-right">
               <p>KapitalBank</p>
               <p>VÖEN: 2006113431</p>
               <p>Hesab №: AZ97AIIB40060019440819871103</p>
               <p>Müxbir hesab №: AZ37NABZ01350100000000001944</p>
               <p>Valyuta: AZN Kod: 200037 SWIFT: AIIBAZ2XXXX</p>
            </td>
         </tr>

         <br>
         <br>

         <tr>
            <td class="account">
               <strong>Hesab - faktura №7383</strong>
               <br><br>

               <span>Xidmətin təsviri:</span>
               <p>14.04.2023-cü il</p>
               <span>Tarix:</span>
               <p>Reklam paketinin (Mashin.al - Standart paketi) təqdim olunması üçün avans ödənişi</p>
               <span>Xidmətin müddəti:</span>
               <p>14.04.2023 - 14.05.2023</p>
               <span>Elan sayı:</span>
               <p>50</p>
               <span>Ödənişli xidmətlər:</span>
               <p>150.00 AZN</p>
            </td>
         </tr>

         <tr>
            <td class="invoiceBanner">
               <p> Məbləğ: <span>246.00 AZN</span></p>
               <p> ƏDV: <span>246.00 AZN</span></p>
               <p> Ümumi məbləğ: <span class="total">246.00 AZN</span></p>
            </td>
         </tr>
      </tbody>

      <tfoot class="tfoot">
         <tr>
            <td>
               <div class="tfoot__top"></div>
               <span>"ALVENTURES" MMC-nin İcraçı Direktoru:</span>
               <p>Elçin Məmmədov</p>
            </td>
         </tr>
      </tfoot>
   </table>
</template>


<style>
   .tfoot span {
      font-size: 10px;
      font-weight: 500;
      line-height: 12px;
      color: #9C9C9C;
   }

   .tfoot p {
      font-size: 12px;
      font-weight: 600;
      line-height: 15px;
      color: #0A1A3D;
   }


   .tfoot__top {
      width: 180px;
      margin-top: 72px;
      border: 1px solid #FFE9EC;
   }

   table {
      width: 600px;
   }

   .invoiceBanner {
      background-image: url("/images/invoice_price_bg.svg");
      height: 150px;
      background-repeat: no-repeat;
   }

   .invoiceBanner p {
      color: #fff;
      margin-left: 22px;
      margin-bottom: 5px;
   }

   .invoiceBanner p span {
      margin-left: 68px;
   }

   .invoiceBanner p span.total {
      font-size: 16px;
      font-weight: 700;
      line-height: 20px;

   }

   .account strong {
      font-size: 14px;
      font-weight: 600;
      line-height: 17px;
      color: #0A1A3D;
      margin-bottom: 20px;
   }

   .account span {
      font-size: 12px;
      font-weight: 500;
      line-height: 15px;
      color: #9c9c9c;
      margin-bottom: 8px;

   }

   .account p {
      font-size: 12px;
      font-weight: 400;
      line-height: 14px;
      color: #0A1A3D;
      margin-bottom: 20px;
   }

   .voin strong {
      font-size: 14px;
      font-weight: 600;
      line-height: 17px;
      color: #0A1A3D;
   }

   .voin p {
      margin-top: 8px;
      font-size: 12px;
      font-weight: 400;
      line-height: 14px;
      color: #0A1A3D;
   }

   .voinRightSide p {
      font-size: 10px;
      font-weight: 400;
      line-height: 12px;

   }

   .voin p span {
      font-weight: 500;
      line-height: 15px;

      color: #9C9C9C;
   }

   .headLine {
      border-bottom: 2px solid red;
   }

   .headLine__info {
      display: flex;
      align-items: center;
   }

   .headLine__borderLong {
      width: 2px;
      background: red;
      margin: 0 8px;
      height: 50px;
   }

   .headLine__image {
      width: 55px;
      height: 55px;
   }

   .headLine__call {
      font-size: 16px;
      font-weight: 700;
      line-height: 20px;
      color: red;
   }

   .headLine__address {
      font-size: 10px;
      font-weight: 500;
      line-height: 12px;
      color: #081A3E;
   }


   .headLine__link {
      font-size: 10px;
      font-weight: 700;
      line-height: 12px;
      color: #081A3E;

   }

   .text-right {
      text-align: right;
      float: right;
   }

   .text-left {
      text-align: left;
      float: left;

   }
</style>

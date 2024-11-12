// module.exports = ({ username, grupoMuscular1, exercicios,series1, reps1 }) => {
//    const today = new Date();

//    return `
//    <!doctype html>
//    <html>
//       <head>
//          <meta charset="utf-8">
//          <title>PDF Result Template</title>
//          <style>
//             .invoice-box {
//                max-width: 800px;
//                margin: auto;
//                padding: 30px;
//                border: 1px solid #eee;
//                box-shadow: 0 0 10px rgba(0, 0, 0, .15);
//                font-size: 14px;
//                line-height: 20px;
//                font-family: 'Helvetica Neue', 'Helvetica',
//                color: #555;
//             }
//             .margin-top {
//                margin-top: 50px;
//             }
//             .justify-center {
//                text-align: center;
//             }
//             .invoice-box table {
//                width: 100%;
//                line-height: inherit;
//                text-align: left;
//                border-collapse: collapse;
//                margin-top: 20px;
//             }
//             .invoice-box table td, .invoice-box table th {
//                border: 1px solid #ddd;
//                padding: 8px;
//                font-size: 14px;
//                text-align: center; /* Centraliza o conteúdo das células */
//             }
//             .invoice-box table tr:nth-child(even) {
//                background-color: #f2f2f2;
//             }
//             .invoice-box table tr:hover {
//                background-color: #ddd;
//             }
//             .invoice-box table th {
//                padding-top: 12px;
//                padding-bottom: 12px;
//                text-align: center; /* Centraliza o texto no cabeçalho */
//                background-color: #143a70; /* Cor de fundo azul */
//                color: white;
//                font-size: 14px;
//             }
//             /* Adiciona uma borda direita para separar as colunas de Séries / Repetições */
//             .invoice-box table td:nth-child(2),
//             .invoice-box table td:nth-child(3) {
//                border-right: 1px solid #ddd;
//             }
//          </style>
//       </head>
//       <body>
//          <div class="invoice-box">
//             <table>
//                <tr class="top">
//                   <td colspan="3" style="text-align: center;">
//                      <img src="http://192.168.10.202:8080/conquistas/fd7384ad-e364-4069-aecd-815a9bc4ca99.svg"
//                      style="width: 200px; max-width: 100%;">
//                   </td>
//                </tr>
//                <tr>
//                   <td colspan="3" style="text-align: center;">
//                      <h2 style="font-size: 16px;">Nome: ${username}</h2>
//                   </td>
//                </tr>
//                <tr>
//                   <th style="background-color: #143a70;">Exercícios - ${grupoMuscular1}</th>
//                   <th style="background-color: #143a70;">Séries</th>
//                   <th style="background-color: #143a70;">Repetições</th>
//                </tr>
//                ${exercicios.map(exercicio => `
//                   <tr>
//                      <td>${exercicio.exercicio1}</td>
//                      <td>${series1}</td>
//                      <td>${reps1}</td>
//                   </tr>
//                `).join('')}
             
//             </table>
//          </div>
//       </body>
//    </html>
//    `;
// }
module.exports = ({ username, grupoMuscular, exercicios }) => {
   // Verifica se exercicios é um array válido
   const exerciciosArray = Array.isArray(exercicios) ? exercicios : [];

   return `
   <!doctype html>
   <html>
      <head>
         <meta charset="utf-8">
         <title>PDF Result Template</title>
         <style>
            .invoice-box {
               max-width: 800px;
               margin: auto;
               padding: 30px;
               border: 1px solid #eee;
               box-shadow: 0 0 10px rgba(0, 0, 0, .15);
               font-size: 14px;
               line-height: 20px;
               font-family: 'Helvetica Neue', 'Helvetica', sans-serif;
               color: #555;
            }
            .margin-top {
               margin-top: 50px;
            }
            .justify-center {
               text-align: center;
            }
            .invoice-box table {
               width: 100%;
               line-height: inherit;
               text-align: left;
               border-collapse: collapse;
               margin-top: 20px;
            }
            .invoice-box table td, .invoice-box table th {
               border: 1px solid #ddd;
               padding: 8px;
               font-size: 14px;
               text-align: center;
            }
            .invoice-box table tr:nth-child(even) {
               background-color: #f2f2f2;
            }
            .invoice-box table tr:hover {
               background-color: #ddd;
            }
            .invoice-box table th {
               padding-top: 12px;
               padding-bottom: 12px;
               text-align: center;
               background-color: #143a70;
               color: white;
               font-size: 14px;
            }
         </style>
      </head>
      <body>
         <div class="invoice-box">
            <table>
               <tr class="top">
                  <td colspan="3" style="text-align: center;">
                     <img src="http://192.168.10.204:8080/conquistas/diaDeCostas.svg"
                     style="width: 200px; max-width: 100%;" alt="Logo">
                  </td>
               </tr>
               <tr>
                  <td colspan="3" style="text-align: center;">
                     <h2 style="font-size: 16px;">Nome: ${username}</h2>
                  </td>
               </tr>
               <tr>
                  <th style="background-color: #143a70;">Exercícios - ${grupoMuscular}</th>
                  <th style="background-color: #143a70;">Séries</th>
                  <th style="background-color: #143a70;">Repetições</th>
               </tr>
               ${exerciciosArray.length > 0 ? 
                 exerciciosArray.map(exercicio => `
                   <tr>
                      <td>${exercicio.exercicio || 'Desconhecido'}</td>
                      <td>${exercicio.series || '-'}</td>
                      <td>${exercicio.reps || '-'}</td>
                   </tr>
                 `).join('') :
                 `<tr><td colspan="3">Nenhum exercício encontrado</td></tr>`}
            </table>
         </div>
      </body>
   </html>
   `;
}

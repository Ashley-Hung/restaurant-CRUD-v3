# 我的餐廳清單

這是一個由 Node.js 和 Express 建立的餐廳網站。

## 主要功能

- 可以使用個人的 email 或 Facebook 註冊帳號並登入
- 可以讓使用者於主畫面上快速瀏覽餐廳圖片、名稱、評分等
- 使用者可以點進感興趣的餐廳查看更詳細的資訊
- 透過餐廳的中英文名稱或餐廳類別來搜尋相關的餐廳
- 新增餐廳
- 修改餐廳資訊
- 刪除餐廳
- 依照名稱、類別、評分排序

![demo image](https://github.com/Ashley-Hung/restaurant-CRUD-v3/blob/main/demo.png)



## 建置環境

- [Node.js](https://nodejs.org/en/)：14.16.1
- [Express](https://www.npmjs.com/package/express)：4.17.1
- [Express-Handlebars](https://www.npmjs.com/package/express-handlebars)：5.3.0
- [mongoose](https://www.npmjs.com/package/mongoose)：5.12.6
- [mongoDB](https://www.mongodb.com/try/download/community)：4.2.13
- [method-override](https://www.npmjs.com/package/method-override)：3.0.0
- [bcryptjs](https://www.npmjs.com/package/bcryptjs)：2.4.3
- [connect-flash](https://www.npmjs.com/package/connect-flash)：0.1.1
- [dotenv](https://www.npmjs.com/package/dotenv)：10.0.0
- [express-session](https://www.npmjs.com/package/express-session)：1.17.2
- [express-validator](https://www.npmjs.com/package/express-validator)：6.11.1
- [passport](https://www.npmjs.com/package/passport)：0.4.1



## 安裝與執行

1. clone 此專案至本機電腦

   ```
   $ git clone https://github.com/Ashley-Hung/restaurant-CRUD-v3.git
   ```

2. 安裝

   ```
   $ cd restaurant-CRUD-v3
   $ npm install
   ```

3. 執行

   ```
   $ npm run seed
   $ npm run dev
   ```

4. 執行成功後，Terminal 會顯示下列訊息

   ```
   App is listening on localhost:3000
   ```

5. 使用下列 URL 於瀏覽器上進行瀏覽

   ```
   http://localhost:3000
   ```




## 開發者

Ashley-Hung




# BTL_TMDT

npx sequelize-cli db:migrate

npm i

-tạo file .env
-env backend:

PORT=8080
REACT_URL=http://localhost:3000
JWT_SECRET=jwt
JWT_EXPIRES_IN=30

VNP_TMNCODE=RO7HO2AP
VNP_HASHSECRET=UPMJR640IK8A0ZN052HAPTHDXGYVPRBC
VNP_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNP_RETURN_URL=http://localhost:8080/api/v1/payment-return
VNP_API=https://sandbox.vnpayment.vn/merchant_webapi/api/transaction

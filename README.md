# MethodSWE

## Local development
### Pre-requisites
1. Setup server `.env` file
    ```
    echo "PORT=8080
	MONGO_URI=<mongodb-uri>
	METHOD_API_KEY=<method-api-key>" > ./server/.env
	```
2. `npm install` all dependencies

### Get started
1. In two separate terminal windows, run `npm start` in `./client` and `./server`
    - The frontend should open at localhost:3000 and the backend should be running on localhost:8080

## Production  Wishlist
- Visualize the csv data on the frontend
- Add pagination or visualization for the ListView
- Save XML file in blob storage like S3
- Dockerize the app
- Currently use [Bottleneck](https://github.com/SGrondin/bottleneck#readme) as a queueing and throttling mechanism but would be better to use a message queue like kafka
- Push notifications (email/sms) for completed batch submission
	- Server sent events to update the frontend without the need of refreshing the page
- Send email with generated reports
- Add a cache like Redis for faster queue and search up of data

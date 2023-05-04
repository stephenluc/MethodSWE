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
- After submitting payments to Method API, be able to visualize the csv data on the frontend so you don't need to solely rely on downloading the csv reports
- Add pagination or visualization for the ListView, this will help better for scaling
- Being able to save the xml files in a blob storage in case server goes down during parsing we would be able to restart from where the process was killed at
- Since all of this is being run on a monolithic node server, it would be better to implement all the different services into their own microservice and run them in docker containers across different servers to help overcome Method's rate limiting
- Currently use [Bottleneck](https://github.com/SGrondin/bottleneck#readme) as a queueing and throttling mechanism for external requests to Method to avoid rate limiting. We would want to use a message queue like Kafka to stream these requests as most of them are independant from each other.
- Push notifications would help with user experience. We need to refresh the page after submitting long queued requests, such as uploading large xml files with new employee or corporation information since we need to hit Method API to create those. So we would want some sort of push notification to inform users when files have been done uploading and processing without them needing to  constantly refreshing the page.
	- We would want to add server sent events to update the frontend without the need of refreshing the page
	- We would also want to add email/sms push notifications to let the user know that these processes are complete so they don't have to monitor their computer the whole time
	- We would want to also want to send the user an email with generated reports, especially for getting all payment information, as generating reports linearly increases with file size. This allows people to request reports and leave their computers.
- Add a cache like Redis to track Method fetching of objects so the information isn't volatile. Additionally, a cache like Redis can be used to retreive data faster such as storing the most recently submitted batches and payments so they can be retreived faster

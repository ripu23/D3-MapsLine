# D3-sample
The repository contains my visualisation sample as part of the course Data Visualisation. On successfully running the files, you will be able to see world map which displays population encoded in colour. It is a type of chloropleth map. The map is an interactive one.
I have used D3 library for this project. Using D3, I read the topojson file and plot the map on the svg. Then a different dataset is used for displaying population on the map.

The sample reads a csv file from javascript file and hence it won't be possible to run it without a server.
To get a server you can do either of the following:

## Xampp
1. Install [Xampp](https://www.apachefriends.org/download.html)
2. Place all the files in the *htdocs* folder.
3. Run the xampp server and run the files.

## Chrome extension
1. Install the [chrome extension](https://chrome.google.com/webstore/detail/web-server-for-chrome/ofhbbkphhbklhfoeikjpcbhemlocgigb?hl=en)
2. Choose the cloned folder on the extension.
3. Go to the url provided by the extension and you are good to go.

## Other ways
Creating a server using Node.js or using apache server are other good options.

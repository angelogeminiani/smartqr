# SmartQR
      
  Mapping service for QRCode-to-URL redirection.
  built on [node](http://nodejs.org) and [Connect](http://github.com/senchalabs/connect).
  

## QuickStart

Please, visit [SmartQR site](http://www.smartfeeling.org/smartqr)
for more details and news.
	
Start with SmartQR is very easy:

	1) Configure HTTP server editing the file "smartqr/_workspace/settings/http.json".
	
	{
		"domain": "localhost",
		"port":9000,
		"htdocs": "./htdocs"
	}

	2) Configure redirection editing the file "smartqr/_workspace/settings/redirections/redirect301.json"
	
	{
		"/test/1":"http://www.google.it",
		"/test/2":"http://www.smartfeeling.org"
	}
	
	3) Print QRCodes (i.e. http://yourserver/test/1) and test.
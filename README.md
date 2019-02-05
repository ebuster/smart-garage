Set of modules wich allows you to build your own monitoring\automation device for 
garage or greenhouse.

Project on early stage of development and can't be used *as-is* due to unresolved 
connection stability issues and Mosquito client implementation bugs. If you find 
what here might be improved or fixed - please let me know.

Goal
---- 
Project created to keep my garage warm in Winter conditions and dry after Autumn rains. 
Initial plan was to allows remotely monitor multiple sensors data and control relays 
(connected to 2ch heater and ventilation fun, for example). Thankfully to event bases 
and extendable (modules) structure, amount of controlled relays and monitored sensors 
is limited only by used board and your needs.

Details
----
* Remote control\monitor implemented through **Blink** App or **mqtt** server (in progress).
* Internet connection implemented by **Wi-Fi** (ESP8266) or **Sim800** module (not stable).
* Automatic relays control based on sensors data is also implemented, but currently not tested 
and disabled by this reason.
* All options are stored in config file.

Plans
------
* Add more details;
* Add usage examples;
* Add display lights control based on moving sensor;
* Add Modules to control water rellay, used to refill a barrel of water on rain time;
* Add Modules to control water pump, on cellar flooding time :(
* Add some security features.

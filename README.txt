GROUP MEMBERS:
Nidhi Doshi (npdoshi)
Anish Phophaliya (aphophal)
Dhaval Shah (dhavals)



Some instructions that might help you test this homework:

There are two players with the following hardcoded usernames and passwords:

Player 1 ---
Username: 'bob'
Password: 'bobby'

Player 2 ---
Username: 'tom'
Password: 'tommy'

URL you need to go to in order to connect with (on the phone):
localhost:8080/www/client.html

URL you need to go to in order to view the game:
localhost:8080/www/view.html

Note that the IP address is hardcoded, so you might need to change it to the one on which you're testing to get sockets to work.

TO PLAY THE GAME:

We are using the X-axis of the accelerometer in order to move the paddles. If the accelerometer value is > 1.5, the paddle moves up. If it's < -1.5 the paddle moves down.
If the value is within 1.5 and -1.5, then the paddle stays still.




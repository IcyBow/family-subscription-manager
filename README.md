# Family subscription manager
Simple webapp to manage the payment of your family subscription.
## Roadmap
### HTML/JS
- [ ] Build admin page
    - [ ] Create users
    - [ ] Show users
    - [ ] Show subscriptions
    - [ ] Show payments
    - [ ] Manage payments to the service
    - [ ] Manage payments from co-subscribers
    - [ ] Refresh when update successfull
- [x] Build viewer page
    - [x] Show payments
    - [x] Show sum of payments and due amounts
- [ ] Styling
- [ ] Document installation and use 
### PHP/DB
- [x] Create DB
- [x] Initialize DB
- [ ] Create users
- [ ] Create subscriptions
- [ ] Manage payments to the service
- [ ] Manage payments from co-subscribers
- [ ] Document installation and use 
### Nice to have
- [ ] Initialize DB interactively 
- [ ] Dockerize project
- [ ] Send emails to admin directly on the page
- [ ] Send emails to subribers directly on page (maybe with templates like: amount due, recaps)
- [x] Set currency as env variables 
- [ ] Store data in cache when update successfull and reapply when loading finished
## Developement
I will work on this in my spare time as it is not something I need urgently. If you have any suggestion or question, you can [reach me](mailto:contact@icybow.com).
This project will also be used for me to work on my *native JS* skills, so there will be no or very few external libraries. I am also not a big designer and it is not a very serious project that I am not even sure I will use productively (an Excel sheet does exactly the same(I already have it with all history)), but if you feel like improving the design (or anything else), feel free to do so.
## Safety
!!!DISCLOSURE: The safety is **very rudimentary** and intented to be like that. So use it at your own risk and don't put any sensitive or personal information!!!\
My idea when developing this is to have something simple, quick and accessible. So I made the most important data for a user a random uuid. This is uuid is what will pilot the app, it is the 'login'. That means is someone has your uuid or manages to guess it (if someone does so, he almost deserves to use it), then he will be able to 'login' as that user. Please don't put sensitive/personal information, it is pretty simple to just find a nickname for everybody or if you really don't know what to put you can always ask the person, what they would like as nickname.
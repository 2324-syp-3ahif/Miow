

drop table Users;
Create Table Users(
UserId number primary key,
UserName varchar2(255),
UserPassword varchar2(255)
);

drop table UserSettings;
Create Table UserSettings(
UserId number primary key,
ThemeNr number,
HasPeriod boolean,
foreign key (UserId) references Users(UserId)
);

drop table Entry;
create table Entry(
UserId number,
EntryDate Date,
mood number,
period_type number,
Water number,
sleep number,
primary key(UserId,EntryDate),
foreign key (UserId) references Users(UserId)
);


drop table Weathers;
create table Weathers(
UserId number,
EntryDate Date,
sunny boolean,
cloudy boolean,
rainy boolean,
snowy boolean,
windy boolean,
primary key(UserId,EntryDate),
foreign key (UserId) references Users(UserId),
foreign key (EntryDate) references Entry(EntryDate)
);




drop table Emotions;
create table Emotions(
UserId number,
EntryDate Date,
exited boolean,
relaxed boolean,
proud boolean,
hopeful boolean,
happy boolean,
lonely boolean,
emo boolean,
anxious boolean,
sad boolean,
anrgy boolean,
tired boolean,
primary key(UserId,EntryDate),
foreign key (UserId) references Users(UserId),
foreign key (EntryDate) references Entry(EntryDate)
);

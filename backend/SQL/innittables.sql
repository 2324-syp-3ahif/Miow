;


Create Table Users(
UserId number primary key,
UserName varchar2(255),
UserPassword varchar2(255)
);

Create Table UserSettings(
UserId number primary key,
ThemeNr number,
HasPeriod boolean,
foreign key (UserId) references Users(UserId)
);

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

create table chores(
UserId number,
EntryDate Date,
sweep_flor boolean,
do_dishes boolean,
do_loundry boolean,
work_out boolean,
clean_windows boolean,
primary key(UserId,EntryDate),
foreign key (UserId) references Users(UserId),
foreign key (EntryDate) references Entry(EntryDate)
);



create table Emotions(
UserId number,
EntryDate Date,
exited boolean,
relaxed boolean,
proud boolean,
hopeful boolean,
happy boolean,
pit_a_pet boolean,
hungry boolean,
gloomy boolean,
lonely boolean,
depressed boolean,
anxious boolean,
sad boolean,
anrgy boolean,
tired boolean,
primary key(UserId,EntryDate),
foreign key (UserId) references Users(UserId),
foreign key (EntryDate) references Entry(EntryDate)
);

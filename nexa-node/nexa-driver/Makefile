all: compile run

compile:
	gcc -lwiringPi main.c nexa.c -o main

run:
	sudo nice -n -19 ./main
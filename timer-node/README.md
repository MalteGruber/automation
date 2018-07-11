# Timer node
The timer is a node that can send messages at a certain absolute time, or after a certain duration.

## Commands
The timer is controlled with the `timecmd` object.
### SET
The command `timecmd.cmd:"SET"` will set a timer. If the time is given as `timecmd.time` the time is absolute.
If the time is given as `timecmd.in`. All times are in given in seconds and absolute times in UNIX UTC.

The actions to performe are specified using the `timecmd.action` array. This array of objects will be broadcast as individual commands when the timer finishes.

### LIST
The command `timecmd.cmd:"LIST"` will list all timers.

### PURGE
The command `timecmd.cmd:"PURGE"` will delete ALL timers.
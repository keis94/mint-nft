#!/bin/sh

# settings
icon_size=256
border=8
font='ArialBk'
color='#424242'

# variables
label=$1
background_color=$2
file_name=`echo $label | tr '[:upper:]' '[:lower:]' | tr -d '\n'`
file_name="icon_$file_name.png"
size=`expr $icon_size - $border \* 2`

# generate
convert \
	-size "${size}x${size}" -background $background_color \
	-fill $color -font $font -gravity center label:$label \
	-bordercolor $color -border $border \
	$file_name
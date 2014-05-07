#!/usr/bin/env python
import sys, os

def read_file(file_name):
	file = open(file_name, 'r+')
	lines = file.readlines()

	version_line = 0 
	for index, line in enumerate(lines):
		if(line.find('version') != -1 ):
			version_line = index 
			break ;

	version = lines[version_line].strip().split(':')[1][2:-2].split('.')
	version3 =str(int(version[2]) + 1 )
	final_version_line = '  ' + '"version": "' + version[0] + '.' + version[1] + '.' + version3 + '",\n' 
	lines[version_line]  = final_version_line 
	
	file.close()

	file = open(file_name, 'r+')
	file.writelines(lines)
	file.close

if(__name__=="__main__"):
	files = ['bower.json', 'package.json', 'share.jquery.json']
	print 'version plusing ...\n'
	for file_name in files:
		print '    working on: ' + file_name + ' ...'
		read_file(file_name)
		print '    success\n'	
	print 'ok, all file changes.\n'






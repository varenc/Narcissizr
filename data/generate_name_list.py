import csv

COMMON_WORD_BLACKLIST_CUTOFF = 10000

all_names = set()
common_english_words = list()  # must be ordered

with open('census-derived-all-first.txt','rb') as firstnamein:
    for row in csv.reader(firstnamein, delimiter=' '):
        all_names.add(row[0].lower())

with open('app_c.csv', 'rb') as census_names:
    for row in csv.reader(census_names, delimiter=','):
        all_names.add(row[0].lower())

with open('my_facebook_friend_list.txt', 'rb') as fb_list:
    # surprisingly this adds about 600 names not found in any of the other sources...
    # mainly seems to add more common non-english names.  Need a better
    # list of names that'll apply more globally
    for row in csv.reader(fb_list):
        if len(row[0]) >= 3 and any([l in list("aeiouy") for l in row[0]]):
            all_names.add(row[0].lower())

with open('google-10000-english.txt', 'rb') as common_words:
    for row in csv.reader(common_words):
        common_english_words.append(row[0].lower())

# print('original length:', len(all_names))
all_names -= set(common_english_words[:COMMON_WORD_BLACKLIST_CUTOFF])

# print('new length:', len(all_names))
javascript_list = "\n".join(['"%s",' % name for name in all_names])

javascript = """all_names = new Set([\n%s])""" % javascript_list
print(javascript)





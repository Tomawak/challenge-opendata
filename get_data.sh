mkdir data
cd data

wget http://data.assemblee-nationale.fr/static/openData/repository/LOI/scrutins/Scrutins_XIV.json.zip
wget http://data.assemblee-nationale.fr/static/openData/repository/AMO/deputes_actifs_mandats_actifs_organes/AMO10_deputes_actifs_mandats_actifs_organes_XIV.json.zip

for file in *.zip; do
	unzip $file
done
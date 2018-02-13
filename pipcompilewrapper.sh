export CUSTOM_COMPILE_COMMAND="./pipcompilewrapper.sh"
rm requirements.txt
pip-compile --output-file requirements.txt requirements.in
pip-compile --upgrade

echo "https://github.com/LandRegistry/govuk-elements-jinja-macros/archive/v1.0.7.zip" >> requirements.txt
echo "https://github.com/LandRegistry/land-registry-elements/archive/v2.1.14.zip" >> requirements.txt


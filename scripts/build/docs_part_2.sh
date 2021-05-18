set -e
export BUILD_SCRIPTS_DIR=$(dirname $0)

timer_start=$(date +%s)
python3 $BUILD_SCRIPTS_DIR/ToC_parse_features.py
timer_end=$(date +%s)
echo "Total execution time for parsing ToC Features: '$(date -u --date @$(( $timer_end - $timer_start )) +%H:%M:%S)'"

echo "Finished building and prepping all Antora content"

# Javadoc Portion of Docs
echo "Begin building javadoc content"
$BUILD_SCRIPTS_DIR/javadoc_clone.sh

# Move the javadocs into the web app
echo "Moving javadocs to the jekyll webapp"
timer_start=$(date +%s)
cp -r src/main/content/docs-javadoc/modules target/jekyll-webapp/docs
timer_end=$(date +%s)
echo "Total execution time for copying javadoc to webapp: '$(date -u --date @$(( $timer_end - $timer_start )) +%H:%M:%S)'"


# Special handling for javadocs
$BUILD_SCRIPTS_DIR/javadoc_modify.sh

echo "Finished building Javadoc content"

echo "Finished building all doc content"
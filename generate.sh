days=1100
total_commit=1500
size=$((days*24*60))
a=$(shuf -i 1-$size -n $total_commit | sort -r -n)
git checkout -b gh-pages
for i in ${a}
    do 
        if [[ $(date -d "-$i minutes" +%u) -gt 5 ]]; then
            echo 'weekend.'
        else
            git commit --allow-empty -m "update main"
            git commit --amend --allow-empty --no-edit --date "$(date -d "-$i minutes")"
        fi
    done 
git push origin gh-pages
git checkout origin/main
read  -n 1 -p "Press any key to exit:" mainmenuinput

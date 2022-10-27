This is a technical test to apply for a fullstack developer job at [FulltimeForce](https://fulltimeforce.com/).

## Preconditions

Since this solution is designed to work in realtime with [GitHub WebHooks](https://docs.github.com/en/developers/webhooks-and-events/webhooks/about-webhooks), and this technology requires a static URL to call when a push is made to the repository, this solution has been deployed to [Vercel](https://vercel.com/) in order to get an static URL and be served easily to the assesment team.

In order to test the realtime part of this solution, you must send an email to [jhvangar@gmail.com](mailto:jhvangar@gmail.com) requesting writting rights to this repository, as soon as those rights are granted you can start the test.

For the next part git is necessary, so if you haven't installed it yet follows this instrucctions [how to install git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).

## Test

First you need to clone the repository, to do that open a terminal in your system and run the next script.

```bash
mkdir jairo_vanegas_test
cd ./jairo_vanegas_test
git clone https://github.com/jairovanegas/git-watcher.git
```

If completed successfully, in order to make changes to the repository so you can make a commit to test the realtime part of the solution, you have to change the file **test.txt** in the root of the folder you made in the previous script.

With the changes made to the file go back to the terminal and execute the next script.

```bash
git add .
git commit -m "{Commit message}"
```
In this part you have everything set to proceed with the test, so please open the web browser and open the solution in the next link [GitWatcher](https://git-watcher-3uar.vercel.app/). All the previous commits are listed, but yours insn't listed yet. To do that go back to the terminal without closing the web browser and execute the next script.

```bash
git push
```

If the push was successfull, go back to the web browser and the new commit you have pushed is showing in the commit history.
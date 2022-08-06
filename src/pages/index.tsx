import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { trpc } from "utils/trpc";

const Home: NextPage = () => {
  const [update, setUpate] = useState(false);
  const [id, setId] = useState(0);
  const NOTE = trpc.proxy.note;
  const notes = NOTE.all.useQuery();
  const utils = trpc.proxy.useContext();
  const addNote = NOTE.add.useMutation({
    async onSuccess() {
      await utils.note.all.invalidate();
    },
  });
  const delNote = NOTE.del.useMutation({
    async onSuccess() {
      notes.refetch();
    },
  });
  const editNote = NOTE.edit.useMutation({
    async onSuccess() {
      notes.refetch();
    },
  });
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container flex flex-col items-center min-h-screen p-4 mx-auto">
        <h1 className="text-center font-bold text-2xl mt-4">Notes</h1>
        <form
          className="w-auto min-w-[25%] max-w-min mx-auto space-y-6 flex flex-col items-stretch"
          onSubmit={async (e) => {
            e.preventDefault();
            const $title: HTMLInputElement = (e as any).target.elements.title;
            const $content: HTMLInputElement = (e as any).target.elements
              .content;
            const input = {
              title: $title.value,
              content: $content.value,
            };
            try {
              await addNote.mutateAsync(input);
              $title.value = "";
              $content.value = "";
            } catch {
              (e: Error) => {
                console.log(e);
              };
            }
          }}
        >
          <input
            className="border-2 rounded border-gray-600 p-1"
            disabled={addNote.isLoading}
            id="title"
            placeholder="Title"
            type="text"
          />
          <textarea
            className="border-2 rounded border-gray-600 p-1"
            disabled={addNote.isLoading}
            id="content"
            placeholder="Content"
          />
          {(update && (
            <button
              className="bg-green-300 text-white rounded p-1"
              // onClick={() => handleUpdate(note)}
              onClick={async (e) => {
                e.preventDefault();
                setUpate(false);
                const title = document.getElementById(
                  "title"
                )! as HTMLInputElement;
                const content = document.getElementById(
                  "content"
                )! as HTMLInputElement;
                const input = {
                  id: id,
                  data: {
                    title: title.value,
                    content: content.value,
                  },
                };
                try {
                  await editNote.mutateAsync(input);
                  title.value = "";
                  content.value = "";
                } catch {
                  (e: Error) => {
                    console.log(e);
                  };
                }
              }}
            >
              Update
            </button>
          )) || (
            <button
              className="bg-blue-500 text-white rounded p-1"
              disabled={addNote.isLoading}
              type="submit"
            >
              Add
            </button>
          )}
        </form>
        <div className="w-auto min-w-[25%] max-w-min mt-5 mx-auto space-y-6 flex flex-col items-stretch">
          <ul>
            {notes.data?.map((note) => (
              <li key={note.id} className="border-b border-gray-600 p-2">
                <div className="flex">
                  <div className="flex-1">
                    <h3 className="font-bold">{note.title}</h3>
                    <p className="text-sm">{note.content}</p>
                  </div>
                  <button
                    onClick={() => {
                      setUpate(true);
                      setId(note.id);
                      const title = document.getElementById(
                        "title"
                      )! as HTMLInputElement;
                      const content = document.getElementById(
                        "content"
                      )! as HTMLInputElement;
                      title.value = note.title;
                      content.value = note.content;
                    }}
                    className="bg-blue-500 rounded px-3 mr-2"
                  >
                    edit
                  </button>
                  <button
                    onClick={() => delNote.mutate(note.id)}
                    className="bg-red-500 px-3 text-white rounded"
                  >
                    X
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </>
  );
};

export default Home;

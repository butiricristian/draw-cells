"use server";

import { db } from "../../lib/firebaseAdmin";

export async function createNewPresentation({ user }: { user: any }) {
  if (!user) return;

  const newPresentation = await db.ref().child("presentations").push({
    user_id: user.uid,
    title: "New Presentation",
  });
  if (!newPresentation?.key) {
    console.error("Failed to create new presentation");
    return;
  }

  await db
    .ref()
    .child("user-presentations")
    .child(user.uid)
    .child(newPresentation.key)
    .set({
      title: "New Presentation",
    });

  return { key: newPresentation.key };
}

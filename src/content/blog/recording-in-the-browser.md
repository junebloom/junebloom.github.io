---
title: How to Record Audio in the Browser
date: 2020-11-05
---

There are three browser APIs we'll need for recording audio:

- [MediaDevices](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices)
- [MediaStream](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream),
- and [MediaRecorder](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder).

MediaDevices is for requesting access to a user's media inputs like cameras and microphones.

MediaStream is for managing a _stream of data_, in our case from the user's input device.

And MediaRecorder is for encoding the data from a MediaStream and packaging it into a _file_.

There is also [Web Audio](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API), which is an API for doing all sorts of really cool audio processing. It isn't necessary at all for basic recording functionality, but it can be used in the middle of the `MediaStream -> MediaRecorder` pipeline to do additional processing. If you're a digital audio nerd, you should definitely give it a look, but I won't be covering it in this article.

## Getting the Input Stream

The browser provides a MediaDevices object for us via `navigator.mediaDevices`. We can use this to get a MediaStream for the user's input device.

```js
async function getStream() {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: false,
    audio: true,
  });

  return stream;
}
```

This will create a MediaStream with the user's default audio input device. Note that `getUserMedia()` returns a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), because the browser asynchronously _prompts the user to request permission_ for access to their device to create the MediaStream.

### Handle the Errors

If the user approves the request _and_ everything is successful, the promise will resolve with a MediaStream object. Otherwise the promise will be rejected with an error. You can see the possible errors [here](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia#Exceptions).

Let's be sure to actually handle any errors, so that our application can either

- gracefully recover,
- or show the user that there is a problem instead of just "not working" from their perspective.

```js
async function getStream() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: false,
      audio: true,
    });

    return stream;
  } catch (error) {
    // Display some error UI.
    // ...
  }
}
```

### Bonus: Passing Constraints

We can also pass additional [constraints](https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamConstraints) to `getUserMedia()`, if we wish. The constraints we passed above specify that we _don't_ want the stream to include a `video` track and we _do_ want an `audio` track.

We can pass an object as the `audio` field to [further constrain](https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints) the properties of the audio track itself to, for example, ask for a stream without noise suppression applied.

```js
const stream = await navigator.mediaDevices.getUserMedia({
  video: false,
  audio: {
    noiseSuppression: false,
  },
});
```

<!-- ### Bonus: Device Selection

... -->

## Recording the Stream

Once we have a MediaStream object, we can create a MediaRecorder and start recording!

```js
const stream = await getStream();
const mediaRecorder = new MediaRecorder(stream);

mediaRecorder.ondataavailable = ({ data }) => {
  // Do something with the resulting file.
  // ...
};

mediaRecorder.onerror = ({ error }) => {
  // Handle any errors that occur during recording.
  // ...
};

// Start recording.
mediaRecorder.start();

// Stop after five seconds.
setTimeout(() => mediaRecorder.stop(), 5000);
```

You'll obviously want `start()` and `stop()` to be triggered in ways that make sense for your app. Probably in response to clicking a button.

The `data` property passed to `ondataavilable` is a [Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob) containing the full resulting audio file, in whatever encoding and format the browser chose automatically (more on this below).

Be aware that `ondataavailable` doesn't _always_ behave this way: If we pass a timeslice argument to `start()`, then `ondataavailable` will fire once per timeslice until recording has ended.

```js
// A Blob will be available every 100ms, and it's up to us to join
// the slices together into a full file once recording has finished.
mediaRecorder.start(100);
```

Take a look at the [MediaRecorder](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder) docs to see all of the available methods and events.

### Bonus: Passing Options

The [MediaRecorder constructor](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder/MediaRecorder) can also accept an options object as its second parameter. We can use this to specify the MIME type, codec, and bits per second of the resulting file, rather than letting the browser choose these automatically.

```js
const mediaRecorder = new MediaRecorder(stream, {
  mimeType: "audio/ogg; codecs=vorbis",
  bitsPerSecond: 128000,
});
```

Be careful setting the MIME type and codec, because browser support for different formats is not consistent. You should use [`MediaRecorder.isTypeSupported()`](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder/isTypeSupported) to ensure that the format is supported, and have fallbacks in case it isn't.

## Conclusion

So there you have it! Recording audio in the browser is pretty straightforward thanks to some well-designed APIs. Always nice to see!

If you want to see a real-world example using these APIs, check out the [Recorder component](https://github.com/junebloom/practical/blob/develop/src/components/Recorder.js) for [Practical](https://junebloom.github.io/practical/), a small audio recorder app I made for practicing vocal exercises and music.

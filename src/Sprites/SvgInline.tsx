import { getDownloadURL, ref } from 'firebase/storage';
import React, { useEffect, useState } from 'react';
import { storage } from '../firebase-config';

interface SvgInlineProps {
  url: string
}

const SvgInline = (props: SvgInlineProps) => {
    const [svg, setSvg] = useState('');
    const [isLoaded, setIsLoaded] = useState(false);
    const [isErrored, setIsErrored] = useState(false);

    useEffect(() => {
      getDownloadURL(ref(storage, props.url))
        .then((url) => {
          fetch(url)
            .then((res: any) => res.text())
            .then((res: any) => setSvg(res))
            .catch(setIsErrored)
            .then(() => setIsLoaded(true))
        })
    }, [props.url]);

    return (
        <div
            className={`svgInline svgInline--${isLoaded ? 'loaded' : 'loading'} ${isErrored ? 'svgInline--errored' : ''}`}
            dangerouslySetInnerHTML={{ __html: svg }}
        />
    );
}

export default SvgInline
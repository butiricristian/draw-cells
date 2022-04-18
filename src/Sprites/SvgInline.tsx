import React, { useEffect, useState } from 'react';

interface SvgInlineProps {
  url: string
}

const SvgInline = (props: SvgInlineProps) => {
    const [svg, setSvg] = useState('');
    const [isLoaded, setIsLoaded] = useState(false);
    const [isErrored, setIsErrored] = useState(false);

    useEffect(() => {
        fetch(props.url)
            .then((res: any) => res.text())
            .then((res: any) => setSvg(res))
            .catch(setIsErrored)
            .then(() => setIsLoaded(true))
    }, [props.url]);

    return (
        <div
            className={`svgInline svgInline--${isLoaded ? 'loaded' : 'loading'} ${isErrored ? 'svgInline--errored' : ''}`}
            dangerouslySetInnerHTML={{ __html: svg }}
        />
    );
}

export default SvgInline
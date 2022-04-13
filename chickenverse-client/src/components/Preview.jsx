const Preview = () => (
    <aside className="grid grid-cols-3 gap-6 select-none py-6">
        {new Array(9).fill(0).map((_, key) => (
            <img
                className="rounded-2xl"
                key={key}
                src={`/assets/${key + 1}.png`}
            />
        ))}
    </aside>
);

export default Preview;

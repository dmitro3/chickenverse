export const emoji = (frame, y) => [
    sprite("emoji", {
        frame,
    }),
    scale(3),
    pos(7, y),
    area(),
    fixed(),
];

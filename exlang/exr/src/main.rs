struct Config<'config> {
    url: &'config str,
}

struct Request<'req> {
    body: &'req str,
}

struct Handler<'config, 'req> {
    config: &'config Config<'config>,
    request: &'req Request<'req>,
}

fn handle<'config, 'req>(handler: &Handler<'config, 'req>) {
    println!("Config URL: {}", handler.config.url);
    println!("Request Body: {}", handler.request.body);
}

fn main() {
    let config = Config { url: "https://example.com" };

    // A block where a request is created.
    {
        let request = Request { body: "Hello, world!" };
        let handler = Handler {
            config: &config,
            request: &request,
        };
        handle(&handler);
        // `request` is dropped here, so `handler` can't be used beyond this block.
    }
}



// // This function returns the longer of two string slices.
// // The lifetime parameter `'a` ensures that the returned reference is valid
// // as long as both input references are valid.
// fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
//     if x.len() > y.len() {
//         x
//     } else {
//         y
//     }
// }

// fn main() {
//     let string1 = String::from("Hello, world!");
//     let string2 = "Greetings";

//     // `longest` returns a reference with lifetime tied to the shorter of the lifetimes of string1 and string2.
//     let result = longest(&string1, string2);
//     println!("The longest string is: {}", result);
// }

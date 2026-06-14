// @admin.route("/admin/add-listing", methods=["GET", "POST"])
// def add_listing():

//     if session.get("role") != "admin":

//         return redirect("/")

//     games = Game.query.all()

//     if request.method == "POST":

//         title = request.form.get("title")

//         description = request.form.get("description")

//         price = request.form.get("price")

//         buy_price = request.form.get(
//                     "buy_price"
//                     )
                
//         game_id = request.form.get("game_id")

//         sale_type = request.form.get("sale_type")

//         image = request.files.get("image")

//         detail_images = request.files.getlist(
//             "detail_images"
//         )

//         # filename = None

//         # if image:

//         #     filename = secure_filename(
//         #         image.filename
//         #     )

//         #     image_path = os.path.join(
//         #         "app/static/uploads",
//         #         filename
//         #     )
//         #     print("Saving image to:", image_path)

//         #     image.save(image_path)

//         #     print("File exists after save:",
//         #         os.path.exists(image_path))

//         import cloudinary.uploader

//         image_url = None

//         if image and image.filename:

//             result = cloudinary.uploader.upload(image)

//             image_url = result["secure_url"]

//         listing = Listing(
//             title=title,
//             description=description,
//             price=price,
//             game_id=game_id,
//             # image=filename,
//             image=image_url,
//             buy_price=buy_price,
//             sale_type=sale_type,
//             seller_id = session["user_id"]
//         )

//         db.session.add(listing)

//         db.session.commit()

//         for img in detail_images:

//             if img.filename:

//                 result = cloudinary.uploader.upload(img)

//                 detail_url = result["secure_url"]

//                 new_image = ListingImage(

//                     image=detail_url,

//                     listing_id=listing.id
//                 )

//                 db.session.add(new_image)

//         db.session.commit()


//         flash("Listing added successfully")

//         return redirect("/admin/add-listing")

//     return render_template(
//         "/admin/add_listing.html",
//         games=games
//     )
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select"
import {
	aesDecrypt,
	aesEncrypt,
	caesarCipher,
	doubleColumnarTransposition,
	playfairCipher,
	singleColumnarTransposition,
	vigenereCipher
} from "@/lib/encryption"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"

export default function EncryptionDemo() {
	const [method, setMethod] = useState("caesar")
	const [input, setInput] = useState("")
	const [key, setKey] = useState("")
	const [key2, setKey2] = useState("")
	const [encrypted, setEncrypted] = useState("")
	const [decrypted, setDecrypted] = useState("")

	const handleEncrypt = () => {
		let result = ""
		switch (method) {
			case "caesar":
				result = caesarCipher(input, parseInt(key) || 0)
				break
			case "vigenere":
				result = vigenereCipher(input, key, "encrypt")
				break
			case "playfair":
				result = playfairCipher(input, key, "encrypt")
				break
			case "singleColumnar":
				result = singleColumnarTransposition(input, key, "encrypt")
				break
			case "doubleColumnar":
				result = doubleColumnarTransposition(input, key, key2, "encrypt")
				break
			case "aes":
				result = aesEncrypt(input, key)
				break
		}
		setEncrypted(result)
	}

	const handleDecrypt = () => {
		let result = ""
		switch (method) {
			case "caesar":
				result = caesarCipher(encrypted, 26 - (parseInt(key) || 0))
				break
			case "vigenere":
				result = vigenereCipher(encrypted, key, "decrypt")
				break
			case "playfair":
				result = playfairCipher(encrypted, key, "decrypt")
				break
			case "singleColumnar":
				result = singleColumnarTransposition(encrypted, key, "decrypt")
				break
			case "doubleColumnar":
				result = doubleColumnarTransposition(encrypted, key, key2, "decrypt")
				break
			case "aes":
				result = aesDecrypt(encrypted, key)
				break
		}
		setDecrypted(result)
	}

	return (
		<div className="h-screen w-full bg-slate-50">
			<motion.div
				initial={{ opacity: 0, y: 100 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				<div className="lg:mt-22 mx-auto space-y-4 bg-slate-50 px-2 pt-5 lg:max-w-lg lg:pt-24">
					<Card className="border-none shadow-sm">
						<CardHeader className="">
							<CardTitle className="text-3xl font-bold text-primary">
								Encryption Demo
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div>
								<Label htmlFor="method">Encryption Method</Label>
								<Select onValueChange={setMethod} value={method}>
									<SelectTrigger id="method">
										<SelectValue placeholder="Select encryption method" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="caesar">Caesar Cipher</SelectItem>
										<SelectItem value="vigenere">Vigenère Cipher</SelectItem>
										<SelectItem value="playfair">Playfair Cipher</SelectItem>
										<SelectItem value="singleColumnar">
											Single Columnar Transposition
										</SelectItem>
										<SelectItem value="doubleColumnar">
											Double Columnar Transposition
										</SelectItem>
										<SelectItem value="aes">AES</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div>
								<Label htmlFor="input">Input Text</Label>
								<Input
									id="input"
									value={input}
									onChange={(e) => setInput(e.target.value)}
								/>
							</div>
							<div>
								<Label htmlFor="key">
									{method === "caesar" ? "Shift(Number only)" : "Key"}
								</Label>
								<Input
									id="key"
									value={key}
									onChange={(e) => setKey(e.target.value)}
								/>
							</div>
							{method === "doubleColumnar" && (
								<div>
									<Label htmlFor="key2">Second Key</Label>
									<Input
										id="key2"
										value={key2}
										onChange={(e) => setKey2(e.target.value)}
									/>
								</div>
							)}
							<div className="space-x-2">
								<Button onClick={handleEncrypt}>Encrypt</Button>
								<Button onClick={handleDecrypt}>Decrypt</Button>
							</div>
							<div>
								<Label htmlFor="encrypted">Encrypted Text</Label>
								<Input id="encrypted" value={encrypted} readOnly />
							</div>
							<div>
								<Label htmlFor="decrypted">Decrypted Text</Label>
								<Input id="decrypted" value={decrypted} readOnly />
							</div>
						</CardContent>
					</Card>
				</div>
			</motion.div>
		</div>
	)
}
